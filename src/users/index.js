
const usersRouterFactory = require('./users.router')
const getUser = require('./getUser')
const getListUsers = require('./getListUsers')
const checkToken = require('../../middleware/checkToken')

module.exports = {
  usersRouterFactory,
  getUser,
  getListUsers,
  checkToken,
}
