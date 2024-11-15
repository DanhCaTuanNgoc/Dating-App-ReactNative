const express = require('express')
const cors = require('cors')
const userInfoRouter = require('./routes/userInfo')
const userInterestsRouter = require('./routes/userInterests')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/userInfo', userInfoRouter)
app.use('/userInterests', userInterestsRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
