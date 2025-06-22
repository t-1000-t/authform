const Users = require('../models/User')
const Notes = require('../models/Note')
const CVdata = require('../models/CVdata')
const usersRouterFactory = require('./users.router')
const getUser = require('./getUser')
const getListUsers = require('./getListUsers')
const checkToken = require('../../middleware/checkToken')

module.exports = {
  Users,
  Notes,
  CVdata,
  usersRouterFactory,
  getUser,
  getListUsers,
  checkToken,
}
