const express = require('express')
const router = express.Router()
const login = require('./login')
const register = require('./register')
const logout = require('./logout')
const notes = require('./notes')
const verifyEmail = require('./verifyEmail')
const getNotesUser = require('./getNotesUser')
const delNoteUser = require('./delNote')
const cvdata = require('./cvdata')
const generatePdf = require('../service/generatePdf')
const getdatacv = require('./getdatacv')
const delSkill = require('./delSkillFromCv')


router
  .post('/login', login)
  .post('/signup', register)
  .post('/logout', logout)
  .post('/notes', notes)
  .post('/cvdata', cvdata)
  .post('/cvinfo', getdatacv)
  .post('/cvpdf', generatePdf)
  .get('/notes', getNotesUser)
  .delete('/notes/:id', delNoteUser)
  .delete('/cv/:cvId/skills/:skillId', delSkill)
  .get('/verify/:emailToken', verifyEmail)

module.exports = router
