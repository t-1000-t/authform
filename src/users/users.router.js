const express = require('express')

const usersRouterFactory = (checkToken, getUser, getListUsers, User) => {
    const router = express.Router()
    router
        .get('/', checkToken, getUser)
        .get('/list', getListUsers(User))
    
    return router
}

module.exports = usersRouterFactory
