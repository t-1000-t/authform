const checkToken = require('./checkToken')
const { sendVerificationMail } = require('./sendVerificationMail')
// const { createMailTransporter } = require('./createMailTransporter')
const { createMailAutoRefresh } = require('./createMailAutoRefresh')
const passport = require('./passport')

// module.exports = { passport, sendVerificationMail, createMailTransporter, checkToken }
module.exports = { passport, sendVerificationMail, createMailAutoRefresh, checkToken }