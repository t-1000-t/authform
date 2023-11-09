const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const getQueryParam = require('../helper/getQueryParam')

const { EMAIL_USER_GMAIL, 
  EMAIL_PASS, 
  EMAIL_PORT_GMAIL, 
  EMAIL_HOST,
  EMAIL_SECURE,
  EMAIL_CERTS_REJECT } = process.env

// const oAuth2Client = new google.auth.OAuth2(
//     GMAIL_CLIENT_ID,
//     GMAIL_CLIENT_SECRET,
//     GMAIL_REDIRECT_URI
//     )
    

    // oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })

    // const authUrl = oAuth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: ['https://www.googleapis.com/auth/gmail.readonly'], // Adjust the scope as needed
    // })
    
    // console.log('authUrl', authUrl)

    // const code = getQueryParam(authUrl, 'code')

    // console.log("Authorization code:", code)

const createMailAutoRefresh = (userEmail) => {
    // const accessTokenPlayground = oAuth2Client.getAccessToken().then(({ res }) => {
    //   console.log('res.data', res.data)
    //   return res.data
    // })
    // .catch((error) => {
    //   console.error('Error getting access token:', error)
    // })
    

    // for Gmail Api OAuth2 service
    const emailGmailHost = {
        // service: String(EMAIL_SERVICE),
        host: EMAIL_HOST,
        secure: EMAIL_SECURE,
        port: Number(EMAIL_PORT_GMAIL),
        auth: {
            // type: GMAIL_CLIENT_TYPE,
            user: EMAIL_USER_GMAIL,
            pass: EMAIL_PASS,
            // clientId: GMAIL_CLIENT_ID,
            // clientSecret: GMAIL_CLIENT_SECRET,
            // refreshToken: accessTokenPlayground.refresh_token,
            // accessToken: accessTokenPlayground.access_token,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: EMAIL_CERTS_REJECT,
        },
    }

    const transporter = nodemailer.createTransport(emailGmailHost)

    return transporter
}

module.exports = { createMailAutoRefresh }