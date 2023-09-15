const checkToken = require('./checkToken')
const { sendVerificationMail } = require('./sendVerificationMail')
const { createMailTransporter } = require('./createMailTransporter')
const passport = require('./passport')

module.exports = { passport, sendVerificationMail, createMailTransporter, checkToken }