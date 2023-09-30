const nodemailer = require('nodemailer')

const createMailTransporter = (userEmail) => {

     // from nic.ua housting
    const emailHost = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT_GMAIL),
        secure: Boolean(process.env.EMAIL_SECURE),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }

    // for Gmail Api OAuth2 service
    const emailGmailHost = {
        service: String(process.env.EMAIL_SERVICE),
        auth: {
            type: process.env.GMAIL_CLIENT_TYPE,
            user: process.env.EMAIL_USER_GMAIL,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        }
    }

    // console.log('userEmail', userEmail)
    // console.log(`'${userEmail.includes('gmail') ? 'emailGmailHost' : 'emailHost'}`, userEmail.includes('gmail') ? emailGmailHost : emailHost)
    

    // const emailObj = userEmail.includes('gmail') ? emailGmailHost : emailHost

    // const transporter = nodemailer.createTransport(emailObj)
    const transporter = nodemailer.createTransport(emailGmailHost)

    return transporter
}

module.exports = { createMailTransporter }