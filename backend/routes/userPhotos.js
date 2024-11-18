const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const cloudinary = require('../config/cloudinary')

router.post('/upload', async (req, res) => {
   try {
      const { userId, photoData, isPrimary } = req.body
      
      if (!userId || !photoData) {
         return res.status(400).json({ error: 'Missing required fields' })
      }

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(photoData, {
         folder: `users/${userId}/photos`,
      })

      // Save to database
      const query = `
         INSERT INTO user_photos (user_id, photo_url, is_primary)
         VALUES ($1, $2, $3)
         RETURNING *
      `
      
      const result = await pool.query(query, [
         userId, 
         uploadResponse.secure_url,
         isPrimary
      ])

      res.json(result.rows[0])
   } catch (error) {
      console.error('Error uploading photo:', error)
      res.status(500).json({ error: 'Failed to upload photo' })
   }
})

module.exports = router
