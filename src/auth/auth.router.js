const express = require('express')
const router = express.Router()
const passport = require('passport')
const login = require('./login')
const register = require('./register')
const { appUrl } = require('../../config/config')
router
  .post('/login', login)
  .post('/register', register)
  // .post('/logout', (req, res) => {})
  .get(
    '/google',
    passport.authenticate('google', {
      session: false,
      scope: ['profile'],
    }),
  )
  .get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${appUrl}/error=authBad`,
    }),
    // on succes
    (req, res) => {
      console.log('req.user', req.user)
      // return the token or you would wish otherwise give eg. a succes message
      res.redirect(
        301,
        `${appUrl}/api/auth/callback?token=${'Bearer ' + req.user._doc.token}`
        )
    },

    // on error; likely to be something FacebookTokenError token invalid or already used token,
    // these errors occur when the user logs in twice with the same token
    (err, req, res) => {
      // You could put your own behavior in here, fx: you could force auth again...
      // res.redirect('/auth/facebook/');
      if (err) {
        res.status(400)
        res.render('error', { message: err.message })
      }
    },
  )
  .get('/facebook', passport.authenticate('facebook'))
  .get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/')
    },
  )
  .get('/callback', (req, res) => {
    const query = req.query
    res.json(query)
  })

module.exports = router
