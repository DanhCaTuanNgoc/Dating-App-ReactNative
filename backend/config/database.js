const { Pool } = require('pg')

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'Linder',
   password: '123',
   port: 5432,
   ssl: false
})

// Test kết nối
pool.connect((err, client, release) => {
   if (err) {
      console.error('Error connecting to the database:', err.stack)
      return
   }
   console.log('> Connected to database successfully')
   release()
})

module.exports = pool 