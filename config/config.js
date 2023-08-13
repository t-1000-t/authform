require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 5000
console.log('isDev', isDev)
console.log('process.env.URL_DEV', process.env.URL_DEV)
console.log('process.env.URL_PROD', process.env.URL_PROD)
// const appURL = isDev ? process.env.URL_DEV : process.env.URL_PROD

module.exports = {
  mongodbUri: process.env.MONGO_DB_URI || 'mongodb://localhost:27027',
  port: port,
  mode: process.env.NODE_ENV || 'production',
  appUrl: isDev ? process.env.URL_DEV : process.env.URL_PROD,
  secretJwtKey: process.env.JWT_SECRET_KEY || 'you must write secret key in env',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientKey: process.env.GOOGLE_CLIENT_SECRET,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
}
