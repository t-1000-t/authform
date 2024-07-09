const express = require('express')
const { authRouter } = require('../src/auth')
const { usersRouterFactory, getUser, getListUsers, Users, checkToken } = require('../src/users')

// Inject Users into checkToken here
const checkTokenMiddleware = checkToken(Users)

// Create the users router with the necessary dependencies
const usersRouter = usersRouterFactory(checkTokenMiddleware, getUser, getListUsers, Users)

const router = express.Router()
router.use('/users', usersRouter)
router.use('/auth', authRouter)

module.exports = router
