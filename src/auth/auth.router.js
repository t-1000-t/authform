const express = require('express')
const router = express.Router()
const login = require('./login')
const register = require('./register')
const logout = require('./logout')
const notes = require('./notes')
const verifyEmail = require('./verifyEmail')
const getNotesUser = require('./getNotesUser')
const deleteNoteUser = require('./deleteNote')
const cvdata = require('./cvdata')
const generatePdf = require('../service/generatePdf')
const getdatacv = require('./getdatacv')


router
  .post('/login', login)
  .post('/signup', register)
  .post('/logout', logout)
  .post('/notes', notes)
  .post('/cvdata', cvdata)
  .post('/cvinfo', getdatacv)
  .post('/cvpdf', generatePdf)
  .get('/notes', getNotesUser)
  .delete('/notes/:id', deleteNoteUser)
  .get('/verify/:emailToken', verifyEmail)

module.exports = router
