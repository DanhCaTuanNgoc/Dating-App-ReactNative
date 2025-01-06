const express = require('express')
const cors = require('cors')
const userInfoRouter = require('./routes/userInfo')
const userInterestsRouter = require('./routes/userInterests')
const userPhotosRouter = require('./routes/userPhotos')
const userMatchRouter = require('./routes/userMatch')
const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/userInfo', userInfoRouter)
app.use('/userInterests', userInterestsRouter)
app.use('/userPhotos', userPhotosRouter)
app.use('/userMatch', userMatchRouter)

const PORT = 5000
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
