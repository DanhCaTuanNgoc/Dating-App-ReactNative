require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
   ssl: process.env.DB_SSL === 'true',
})

pool.connect((err, client, release) => {
   if (err) {
      console.error('Error connecting to the database:', err.stack)
      return
   }
   console.log('> Connected to database successfully')
   release()
})

module.exports = pool
