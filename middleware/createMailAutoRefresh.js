const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const { GMAIL_CLIENT_ID, 
  GMAIL_CLIENT_SECRET, 
  GMAIL_REDIRECT_URI, 
  GMAIL_REFRESH_TOKEN, 
  EMAIL_USER_GMAIL, 
  GMAIL_CLIENT_TYPE, 
  EMAIL_PORT_GMAIL, 
  EMAIL_SERVICE } = process.env

const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI
    )

    console.log('GMAIL_REFRESH_TOKEN', GMAIL_REFRESH_TOKEN)

    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })

    // console.log('oAuth2Client GET ACCESS TOKEN', oAuth2Client.getAccessToken())

const createMailAutoRefresh = (userEmail) => {
    const accessTokenPlayground = oAuth2Client.getAccessToken().then((accessToken) => {
      return accessToken.token
    })
    .catch((error) => {
      console.error('Error getting access token:', error);
    })
    

    // for Gmail Api OAuth2 service
    const emailGmailHost = {
        service: String(EMAIL_SERVICE),
        port: Number(EMAIL_PORT_GMAIL),
        auth: {
            type: GMAIL_CLIENT_TYPE,
            user: EMAIL_USER_GMAIL,
            clientId: GMAIL_CLIENT_ID,
            clientSecret: GMAIL_CLIENT_SECRET,
            refreshToken: GMAIL_REFRESH_TOKEN,
            accessToken: accessTokenPlayground,
        }
    }

    const transporter = nodemailer.createTransport(emailGmailHost)

// console.log('transporter REFRESH', transporter);

    return transporter
}

module.exports = { createMailAutoRefresh }