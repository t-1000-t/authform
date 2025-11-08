// rowsSQL.router.js
const express = require('express')
const pool = require('./dbPool')
const router = express.Router()

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
  .delete('/:id', (req, res) => {
    const { id } = req.params

    pool.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.log('Database error', err)
        return res.status(500).json({ error: 'Failed to delete user', details: err.message })
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ message: `User with ID ${id} deleted successfully` })
    })
  })

module.exports = router
