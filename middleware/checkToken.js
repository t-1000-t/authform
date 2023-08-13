const jwt = require('jsonwebtoken')
const config = require('../config/config')
const Users = require('../src/users/users.model')

module.exports = async (req, res, next) => {
  // 1. get token from headers
  // 2. slice Bearer
  // 3. Check token by secretKey + time validation

  const headerToken = req.headers['authorization']

  if (headerToken) {
    const token = headerToken.split('Bearer ')[1]
    try {
      const validToken = jwt.verify(token, config.secretJwtKey)

      if (validToken) {
        req.user = await Users.findOne({ _id: validToken.id })

        next()
      } else {
        res.status(401).json({
          message: 'Unauthorized',
        })
      }
    } catch (error) {
      res.status(401).json({
        message: 'Unauthorized',
      })
    }
  } else {
  }
}
