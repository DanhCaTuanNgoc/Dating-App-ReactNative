import express from 'express'
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
      if (existingUser.rows.length === 0) {
         const insertQuery = `
            INSERT INTO users (phone_number, is_active, last_active) 
            VALUES ($1, true, CURRENT_TIMESTAMP) 
            RETURNING id`
         const newUser = await pool.query(insertQuery, [phoneNumber])
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
         user: result.rows[0]
      })
   } catch (error) {
      console.error('Error in user info:', error)
      res.status(500).json({ error: 'Failed to process user info' })
   }
})

module.exports = router
