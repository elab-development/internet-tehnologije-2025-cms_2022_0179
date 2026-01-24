const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Database connection failed:', err.message);
    } else {
        console.log('Database connected!');
    }
});

module.exports = pool;