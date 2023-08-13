const router = require('express').Router()
const { authRouter } = require('../src/auth')
const { usersRouter } = require('../src/users')

router.use('users', usersRouter)
router.use('/auth', authRouter)

module.exports = router
