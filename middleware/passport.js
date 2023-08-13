/* eslint-disable no-undef */
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
// const LocalStrategy = require('passport-local').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy
// const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../src/users/users.model')

const {
  secretJwtKey,
  // appUrl,
  // googleClientId,
  // googleClientKey,
  // facebookAppId,
  // facebookAppSecret
} = require('../config/config')

module.exports = function (passport) {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = secretJwtKey

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({ _id: jwt_payload.id }, (err, user) => {
        if (err) return done(err, false)

        if (user) return done(null, user)

        return done(null, false)
        // or you could create a new account
      })
    }),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
