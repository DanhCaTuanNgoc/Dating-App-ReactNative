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
      filtered_users AS (
         SELECT u.* 
         FROM users u
         CROSS JOIN user_prefs pref
         WHERE u.id != $1
            AND u.location IS NOT NULL
            -- Nới lỏng điều kiện về giới tính
            AND (
               pref.preferred_gender = 'everyone' 
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
               WHEN (u.gender = COALESCE(
                  (SELECT preferred_gender FROM user_prefs WHERE user_id = $1), 
                  'everyone'
               )) THEN 100
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

   let processedFilters
   if (isNewUser) {
      // Set default filters for new users
      processedFilters = {
         gender: 'everyone',
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
         gender: filters.gender || 'everyone',
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

module.exports = router
