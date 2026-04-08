const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/([?&])sslmode=require(&?)/, '$1').replace(/[?&]$/, '')
  : '';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;