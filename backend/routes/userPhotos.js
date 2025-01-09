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

      // Kiểm tra kích thước
      if (photoData.length > 10000000) {
         return res.status(413).json({ error: 'Image size too large' })
      }

      // Tối ưu upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(photoData, {
         folder: `users/${userId}/photos`,
         transformation: [
            { width: 500, height: 500, crop: 'fill' },
            { quality: 'auto:eco' }, // Sử dụng eco mode để tối ưu
            { fetch_format: 'auto' }, // Tự động chọn format tốt nhất
         ],
         resource_type: 'auto',
         eager_async: true, // Xử lý transformation bất đồng bộ
         eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL, // Optional
      })

      // Save to database with cloudinary_id
      const query = `
         INSERT INTO user_photos (user_id, photo_url, is_primary, cloudinary_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *
      `

      const result = await pool.query(query, [
         userId,
         uploadResponse.secure_url,
         isPrimary,
         uploadResponse.public_id, // Lưu public_id
      ])

      console.log('Lưu ảnh thành công')

      res.json({
         success: true,
         photo_url: uploadResponse.secure_url,
         data: result.rows[0],
      })
   } catch (error) {
      console.error('Server error:', error)
      res.status(500).json({
         error: 'Failed to upload photo',
         details: error.message,
      })
   }
})

router.get('/get/:userId', async (req, res) => {
   const { userId } = req.params
   const photos = await pool.query('SELECT * FROM user_photos WHERE user_id = $1', [
      userId,
   ])
   res.json(photos.rows)
})

router.delete('/delete/:photoId', async (req, res) => {
   try {
      const { photoId, userId } = req.body

      // Lấy cloudinary_id trước khi xóa
      const photoQuery = await pool.query(
         'SELECT cloudinary_id FROM user_photos WHERE id = $1 AND user_id = $2',
         [photoId, userId],
      )

      if (photoQuery.rows.length === 0) {
         return res.status(404).json({ error: 'Photo not found' })
      }

      const { cloudinary_id } = photoQuery.rows[0]

      // Xóa ảnh từ Cloudinary
      if (cloudinary_id) {
         await cloudinary.uploader.destroy(cloudinary_id)
      }

      // Xóa record từ database
      await pool.query('DELETE FROM user_photos WHERE id = $1 AND user_id = $2', [
         photoId,
         userId,
      ])

      console.log('Xóa ảnh thành công')

      res.json({ success: true })
   } catch (error) {
      console.error('Delete error:', error)
      res.status(500).json({
         error: 'Failed to delete photo',
         details: error.message,
      })
   }
})

router.put('/set-primary/:photoId', async (req, res) => {
   const { photoId, currentPrimary } = req.body
   await pool.query('UPDATE user_photos SET is_primary = TRUE WHERE id = $1', [photoId])
   await pool.query('UPDATE user_photos SET is_primary = FALSE WHERE id = $1', [
      currentPrimary,
   ])
   res.json({ success: true })
})

module.exports = router
