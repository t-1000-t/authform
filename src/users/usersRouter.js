const router = require('express').Router()
const getUser = require('./getUser')
const checkToken = require('../../middleware/checkToken')

router.get('/', checkToken, getUser)

module.exports = router
