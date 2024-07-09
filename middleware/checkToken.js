const jwt = require('jsonwebtoken')
const config = require('../config/config')

const checkToken = (Users) => async (req, res, next) => {
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
    res.status(401).json({
      message: 'Unauthorized',
    })
  }
}

module.exports = checkToken
