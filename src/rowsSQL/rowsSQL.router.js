const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const config = require('./config_jawsDB')

// Configure MySQL local connection
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.db,
  port: config.port_db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

router
  .get('/', (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(results)
    })
  })
  .post('/', (req, res) => {
    const { name, email } = req.body
    console.log('name, email', name, email)

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' })
    }

    pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, results) => {
      if (err) {
        console.log('Database error', err)
        return res.status(500).json({
          error: 'Failed to create user',
          details: err.message,
        })
      }
      res.status(201).json({
        id: results.insertId,
        name,
        email,
      })
    })
  })

module.exports = router
