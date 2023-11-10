const nodemailer = require('nodemailer')

const createMailTransporter = (userEmail) => {

    // for Gmail Api OAuth2 service
    const emailGmailHost = {
        service: String(process.env.EMAIL_SERVICE),
        port: Number(process.env.EMAIL_PORT_GMAIL),
        auth: {
            type: process.env.GMAIL_CLIENT_TYPE,
            user: process.env.EMAIL_USER_GMAIL,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        }
    }

    const transporter = nodemailer.createTransport(emailGmailHost)

    return transporter
}

module.exports = { createMailTransporter }