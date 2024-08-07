const express = require('express')
const router = express.Router()
const login = require('./login')
const register = require('./register')
const logout = require('./logout')
const notes = require('./notes')
const verifyEmail = require('./verifyEmail')
const getNotesUser = require('./getNotesUser')
const deleteNoteUser = require('./deleteNote')

router
  .post('/login', login)
  .post('/signup', register)
  .post('/logout', logout)
  .post('/notes', notes)
  .get('/notes', getNotesUser)
  .delete('/notes/:noteId', deleteNoteUser)
  .get('/verify/:emailToken', verifyEmail)

module.exports = router
