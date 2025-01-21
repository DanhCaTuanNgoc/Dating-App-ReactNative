const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.post('/auth/phone', async (req, res) => {
   try {
      const { phoneNumber } = req.body
      if (!phoneNumber) {
         return res.status(400).json({ error: 'Phone number is required' })
      }

      const checkQuery = 'SELECT * FROM users WHERE phone_number = $1'
      const existingUser = await pool.query(checkQuery, [phoneNumber])

      let userId
      let userInfo
      if (existingUser.rows.length === 0) {
         const insertQuery = `
            INSERT INTO users (phone_number, is_active, last_active) 
            VALUES ($1, true, CURRENT_TIMESTAMP) 
            RETURNING id`
         const newUser = await pool.query(insertQuery, [phoneNumber])
         userId = newUser.rows[0].id
      } else {
         userId = existingUser.rows[0].id
         userInfo = existingUser.rows[0]
         const updateQuery =
            'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1'
         await pool.query(updateQuery, [userId])
      }

      res.status(200).json({
         userId,
         userInfo,
         isNewUser: existingUser.rows.length === 0,
      })
   } catch (error) {
      console.error('Error in phone authentication:', error)
      res.status(500).json({ error: 'Failed to process phone authentication' })
   }
})

router.post('/auth/google', async (req, res) => {
   try {
      const { googleId, email } = req.body
      if (!googleId || !email) {
         return res.status(400).json({ error: 'Google ID and email are required' })
      }

      const checkQuery = 'SELECT * FROM users WHERE google_id = $1 AND email = $2'
      const existingUser = await pool.query(checkQuery, [googleId, email])
      let userId
      if (existingUser.rows.length === 0) {
         const insertQuery = `INSERT INTO users (email, google_id, is_active, last_active )
         VALUES ($1, $2, true, CURRENT_TIMESTAMP)
         RETURNING id`
         const newUser = await pool.query(insertQuery, [email, googleId])
         userId = newUser.rows[0].id
      } else {
         userId = existingUser.rows[0].id
         const updateQuery =
            'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1'
         await pool.query(updateQuery, [userId])
      }
      res.status(200).json({
         userId,
         isNewUser: existingUser.rows.length === 0,
      })
   } catch (error) {
      console.error('Error in google authentication:', error)
      res.status(500).json({ error: 'Failed to process google authentication' })
   }
})

router.post('/initial', async (req, res) => {
   try {
      const { userId, name, gender, birthDate } = req.body
      if (!userId || !name || !gender || !birthDate) {
         return res.status(400).json({ error: 'All fields are required' })
      }

      const insertQuery = `
         UPDATE users 
         SET name = $1, gender = $2, birth_date = $3 
         WHERE id = $4 
         RETURNING id, name, gender, birth_date`

      const result = await pool.query(insertQuery, [name, gender, birthDate, userId])

      res.status(200).json({
         success: true,
         user: result.rows[0],
      })
   } catch (error) {
      console.error('Error in user info:', error)
      res.status(500).json({ error: 'Failed to process user info' })
   }
})

router.get('/get/:userId', async (req, res) => {
   const { userId } = req.params
   try {
      const query = 'SELECT * FROM users WHERE id = $1'
      const result = await pool.query(query, [userId])
      res.status(200).json(result.rows[0])
   } catch (error) {
      console.error('Error getting user info:', error)
      res.status(500).json({ error: 'Failed to get user info' })
   }
})

router.get('/get-education-and-relationship', async (req, res) => {
   try {
      const educationQuery = 'SELECT * FROM education_levels'
      const educationResult = await pool.query(educationQuery)
      const relationshipQuery = 'SELECT * FROM relationship_goals'
      const relationshipResult = await pool.query(relationshipQuery)
      res.status(200).json({
         education: educationResult.rows,
         relationship: relationshipResult.rows,
      })
   } catch (error) {
      console.error('Error getting education and relationship:', error)
      res.status(500).json({ error: 'Failed to get education and relationship' })
   }
})

router.post('/update', async (req, res) => {
   const {
      userId,
      name,
      formattedDate,
      gender,
      bio,
      educationId,
      jobTitle,
      relationshipGoalId,
   } = req.body
   try {
      const query = `
         UPDATE users
         SET name = $1, birth_date = $2, gender = $3, bio = $4, education_id = $5, job_title = $6, relationship_goal_id = $7
         WHERE id = $8
         RETURNING id, name, birth_date, gender, bio, education_id, job_title, relationship_goal_id
      `
      const result = await pool.query(query, [
         name,
         formattedDate,
         gender,
         bio,
         educationId,
         jobTitle,
         relationshipGoalId,
         userId,
      ])
      res.status(200).json(result.rows[0])
   } catch (error) {
      console.error('Error updating user info:', error)
      res.status(500).json({ error: 'Failed to update user info' })
   }
})

router.post('/update-location', async (req, res) => {
   const { userId, location } = req.body
   try {
      const { latitude, longitude } = location.coords
      if (!latitude || !longitude) {
         return res.status(400).json({ error: 'Latitude and longitude are required' })
      }
      const query = `
         UPDATE users 
         SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
         WHERE id = $3
         RETURNING ST_AsText(location) as location
      `
      const result = await pool.query(query, [longitude, latitude, userId])
      res.json({
         success: true,
         location: result.rows[0].location,
         newUserInfo: result.rows[0],
      })
   } catch (error) {
      console.error('Error updating user location:', error)
      res.status(500).json({ error: 'Failed to update user location' })
   }
})

module.exports = router
