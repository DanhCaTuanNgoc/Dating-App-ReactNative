const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/matching-list-by-filters', async (req, res) => {
   try {
      const { userId } = req.query

      if (!userId) {
         return res.status(400).json({ error: 'Missing userId parameter' })
      }

      // Log để kiểm tra user preferences
      const userPrefsResult = await pool.query(
         'SELECT * FROM user_preferences WHERE user_id = $1',
         [userId],
      )
      console.log('User preferences:', userPrefsResult.rows[0])

      // Kiểm tra location của user hiện tại
      const userLocationResult = await pool.query(
         'SELECT location FROM users WHERE id = $1',
         [userId],
      )
      console.log('User location:', userLocationResult.rows[0])

      const query = `
      WITH user_prefs AS (
         SELECT * FROM user_preferences WHERE user_id = $1
      ),
      matched_users AS (
         -- Lấy danh sách user_id đã match
         SELECT 
            CASE 
               WHEN user_id_1 = $1 THEN user_id_2
               ELSE user_id_1
            END as matched_user_id
         FROM matches 
         WHERE user_id_1 = $1 OR user_id_2 = $1
      ),
      filtered_users AS (
         SELECT u.* 
         FROM users u
         CROSS JOIN user_prefs pref
         WHERE u.id != $1
            AND u.location IS NOT NULL
            -- Thêm điều kiện loại bỏ người dùng đã match
            AND u.id NOT IN (SELECT matched_user_id FROM matched_users)
            -- Nới lỏng điều kiện về giới tính
            AND (
               pref.preferred_gender = 'all'  
               OR u.gender = pref.preferred_gender 
               OR pref.preferred_gender IS NULL
            )
            -- Nới lỏng điều kiện về độ tuổi
            AND (
               pref.min_age IS NULL 
               OR pref.max_age IS NULL 
               OR EXTRACT(YEAR FROM AGE(u.birth_date)) BETWEEN 
                  COALESCE(pref.min_age, 18) AND COALESCE(pref.max_age, 100)
            )
            -- Nới lỏng điều kiện về khoảng cách
            AND (
               pref.max_distance IS NULL 
               OR ST_DWithin(
                  u.location::geography,
                  (SELECT location FROM users WHERE id = $1)::geography,
                  COALESCE(pref.max_distance, 100) * 1000
               )
            )
      ),
      matched_interests AS (
         SELECT ui.user_id, 
                COUNT(*) as matching_interests_count,
                COUNT(*) * 5 as interest_score
         FROM user_interests ui
         CROSS JOIN user_prefs up
         WHERE ui.interest_id = ANY(COALESCE(up.preferred_interests, ARRAY[]::bigint[]))
         GROUP BY ui.user_id
      ),
      user_scores AS (
         SELECT 
            u.id,
            CASE 
               WHEN (
                  u.gender = COALESCE(
                     (SELECT preferred_gender FROM user_prefs WHERE user_id = $1), 
                     'all'
                  ) 
                  OR (SELECT preferred_gender FROM user_prefs WHERE user_id = $1) = 'all'
               ) THEN 100
               ELSE 0 
            END +
            CASE 
               WHEN ST_Distance(
                  u.location::geography, 
                  (SELECT location FROM users WHERE id = $1)::geography
               ) <= 5000 THEN 100
               WHEN ST_Distance(
                  u.location::geography, 
                  (SELECT location FROM users WHERE id = $1)::geography
               ) <= 10000 THEN 80
               ELSE (50 - LEAST(50, (ST_Distance(
                  u.location::geography, 
                  (SELECT location FROM users WHERE id = $1)::geography
               )::numeric / 1000)))
            END +
            COALESCE(mi.interest_score, 0) +
            CASE 
               WHEN (u.education_id = (
                  SELECT education_id FROM user_prefs WHERE user_id = $1
               ) AND (SELECT education_id FROM user_prefs WHERE user_id = $1) IS NOT NULL) 
               THEN 15
               ELSE 0 
            END +
            CASE 
               WHEN (u.relationship_goal_id = (
                  SELECT relationship_goal_id FROM user_prefs WHERE user_id = $1
               ) AND (SELECT relationship_goal_id FROM user_prefs WHERE user_id = $1) IS NOT NULL) 
               THEN 15
               ELSE 0 
            END as match_score
         FROM filtered_users u
         LEFT JOIN matched_interests mi ON u.id = mi.user_id
      )
      SELECT DISTINCT 
         u.id,
         u.name,
         u.bio,
         u.birth_date,
         u.gender,
         u.education_id,
         u.relationship_goal_id,
         ST_AsText(u.location) as location,
         up.photo_url,
         ROUND(ST_Distance(
            u.location::geography, 
            (SELECT location FROM users WHERE id = $1)::geography
         )::numeric) as distance,
         array_agg(i.name) as interests,
         COALESCE(mi.matching_interests_count, 0) as matching_interests_count,
         us.match_score
      FROM filtered_users u
      JOIN user_scores us ON u.id = us.id
      JOIN user_photos up ON u.id = up.user_id AND up.is_primary = true
      LEFT JOIN user_interests ui ON u.id = ui.user_id
      LEFT JOIN interests i ON ui.interest_id = i.id
      LEFT JOIN matched_interests mi ON u.id = mi.user_id
      GROUP BY 
         u.id, u.name, u.bio, u.birth_date, u.gender, 
         u.education_id, u.relationship_goal_id, u.location, 
         up.photo_url, mi.matching_interests_count, us.match_score
      ORDER BY us.match_score DESC, distance
      `

      // Execute query with single parameter
      const result = await pool.query(query, [userId])

      console.log('Query result count:', result.rows.length)
      console.log('First few results:', result.rows.slice(0, 2))

      const usersWithFormattedDistance = result.rows.map((user) => ({
         ...user,
         distance: Math.round(user.distance / 1000), // Convert to km
      }))

      res.json(usersWithFormattedDistance)
   } catch (error) {
      console.error('Detailed error:', error)
      res.status(500).json({
         error: 'Failed to get nearby users',
         details: error.message,
      })
   }
})

router.post('/update-filters', async (req, res) => {
   const { filters, userId, isNewUser } = req.body
   console.log('DB :' + filters)
   let processedFilters
   if (isNewUser) {
      // Set default filters for new users
      processedFilters = {
         gender: 'all',
         min_age: 18,
         max_age: 35,
         education_id: 26,
         relationship_goal_id: 8,
         max_distance: 10,
         preferred_interests: [],
      }
   } else {
      // Validate existing filters
      if (!filters) {
         return res.status(400).json({ error: 'Filters are required' })
      }

      // Validate and process filter values
      processedFilters = {
         gender: filters.gender || 'all',
         min_age: filters.age[0],
         max_age: filters.age[1],
         education_id: filters.education || null,
         relationship_goal_id: filters.relationshipGoal || null,
         max_distance: filters.distance,
         preferred_interests: filters.selectedInterests || [],
      }
   }

   const query = `
      INSERT INTO user_preferences (
         user_id, 
         preferred_gender, 
         min_age, 
         max_age, 
         education_id, 
         relationship_goal_id, 
         max_distance, 
         preferred_interests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) 
      DO UPDATE SET
         preferred_gender = $2,
         min_age = $3,
         max_age = $4,
         education_id = $5,
         relationship_goal_id = $6,
         max_distance = $7,
         preferred_interests = $8;
   `

   try {
      await pool.query(query, [
         userId,
         processedFilters.gender,
         processedFilters.min_age,
         processedFilters.max_age,
         processedFilters.education_id,
         processedFilters.relationship_goal_id,
         processedFilters.max_distance,
         processedFilters.preferred_interests,
      ])
      res.json({ message: 'Filters updated successfully' })
   } catch (error) {
      console.error('Error updating filters:', error)
      res.status(500).json({
         error: 'Failed to update filters',
         details: error.message,
      })
   }
})

router.get('/get-filters', async (req, res) => {
   const { userId } = req.query
   const filters = await pool.query('SELECT * FROM user_preferences WHERE user_id = $1', [
      userId,
   ])
   res.json(filters.rows[0])
})

// API tạo like/dislike
router.post('/action', async (req, res) => {
   try {
      const { userId, targetUserId, action } = req.body

      // Validate input
      if (!userId || !targetUserId || !action) {
         return res.status(400).json({
            success: false,
            error: 'Missing required fields',
         })
      }

      // Lưu action vào match_history
      try {
         await pool.query(
            'INSERT INTO match_history (user_id, target_user_id, action) VALUES ($1, $2, $3)',
            [userId, targetUserId, action],
         )
      } catch (err) {
         // Nếu action đã tồn tại, bỏ qua
         if (err.code === '23505') {
            // Unique violation
            console.log('Action already exists')
         } else {
            throw err
         }
      }

      // Nếu action là like, kiểm tra match
      if (action === 'like') {
         // Kiểm tra mutual like
         const mutualLike = await pool.query(
            'SELECT * FROM match_history WHERE user_id = $1 AND target_user_id = $2 AND action = $3',
            [targetUserId, userId, 'like'],
         )

         if (mutualLike.rows.length > 0) {
            // Kiểm tra xem match đã tồn tại chưa
            const existingMatch = await pool.query(
               `SELECT * FROM matches 
                WHERE (user_id_1 = $1 AND user_id_2 = $2)
                OR (user_id_1 = $2 AND user_id_2 = $1)`,
               [userId, targetUserId],
            )

            if (existingMatch.rows.length === 0) {
               // Sắp xếp user_id để đảm bảo tính nhất quán
               const [smallerId, largerId] = [userId, targetUserId].sort()

               // Tạo match mới
               const matchResult = await pool.query(
                  'INSERT INTO matches (user_id_1, user_id_2, status) VALUES ($1, $2, $3) RETURNING id',
                  [smallerId, largerId, 'matched'],
               )

               // Lấy thông tin user để trả về
               const targetUserInfo = await pool.query(
                  'SELECT id, name FROM users WHERE id = $1',
                  [targetUserId],
               )

               return res.json({
                  success: true,
                  matched: true,
                  matchId: matchResult.rows[0].id,
                  targetUser: targetUserInfo.rows[0],
               })
            } else {
               return res.json({
                  success: true,
                  matched: false,
                  message: 'Match already exists',
               })
            }
         }
      }

      res.json({ success: true, matched: false })
   } catch (error) {
      console.error('Match action error:', error)
      res.status(500).json({
         success: false,
         error: 'Server error',
         details: error.message,
      })
   }
})

// API lấy danh sách matches
router.get('/list/:userId', async (req, res) => {
   try {
      const { userId } = req.params
      const matches = await pool.query(
         `SELECT m.*, 
                   u.name, u.bio,
                   up.photo_url as avatar_url
            FROM matches m
            JOIN users u ON (u.id = m.user_id_1 OR u.id = m.user_id_2)
            LEFT JOIN user_photos up ON up.user_id = u.id AND up.is_primary = true
            WHERE (m.user_id_1 = $1 OR m.user_id_2 = $1)
            AND m.status = 'matched'
            AND u.id != $1`,
         [userId],
      )
      res.json(matches.rows)
   } catch (error) {
      console.error('Get matches error:', error)
      res.status(500).json({ error: 'Server error' })
   }
})

module.exports = router
