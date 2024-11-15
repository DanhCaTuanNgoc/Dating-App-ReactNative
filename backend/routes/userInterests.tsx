import express from 'express'
const router = express.Router()
const pool = require('../config/database')

router.post('/initial', async (req, res) => {
   const { userId, interests } = req.body
   if (!userId || !interests) {
      return res.status(400).json({ error: 'All fields are required' })
   }
   for (const interest of interests) {
      const insertQuery = `
         INSERT INTO user_interests (user_id, interest_id)
         VALUES ($1, $2)
      `
      const result = await pool.query(insertQuery, [userId, interest.id])
   }
   res.status(200).json({ message: 'User interests initialized' })
})

module.exports = router
