require('dotenv').config()
const mysql = require('mysql2')

const { JAWSDB_URL, NODE_ENV, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env

// hasFullUrl = JAWSDB_URL && /:\/\/.+/.test(JAWSDB_URL) // detect "mysql://..."

// Prefer JAWSDB_URL on Heroku (single URL). Fall back to local env vars.

const poolConnect = () => {
  if (JAWSDB_URL && NODE_ENV === 'production') {
    console.log('We use REMOTE DBSQL')
    return mysql.createPool(JAWSDB_URL)
  } else {
    console.log('We use LOCAL DBSQL')
    return mysql.createPool({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || '12345',
      database: DB_NAME || 'db_goo',
      port: Number(DB_PORT || 5001),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // If your provider needs SSL, uncomment:
      //   ssl: { rejectUnauthorized: true },
    })
  }
}

const pool = poolConnect()

module.exports = pool
