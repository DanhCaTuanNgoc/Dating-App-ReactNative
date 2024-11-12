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
         message:
            existingUser.rows.length === 0 ? 'New user created' : 'Existing user found',
         userId,
         isNewUser: existingUser.rows.length === 0,
      })
   } catch (error) {
      console.error('Error in phone authentication:', error)
      res.status(500).json({ error: 'Failed to process phone authentication' })
   }
})

router.post('/auth/info', async (req, res) => {
   try {
      const { userId, name, gender, birthDate } = req.body
   } catch (error) {
      console.error('Error in user info:', error)
      res.status(500).json({ error: 'Failed to process user info' })
   }
})

module.exports = router
