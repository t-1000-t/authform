const express = require('express')

const usersRouterFactory = (checkToken, getUser, getListUsers, Users) => {
    const router = express.Router()
    router
        .get('/', checkToken, getUser)
        .get('/list', getListUsers(Users))
    
    return router
}

module.exports = usersRouterFactory
