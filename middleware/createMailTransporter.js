const nodemailer = require('nodemailer')

const createMailTransporter = (userEmail) => {

    const emailHost = {
        // service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        // secure: Boolean(process.env.EMAIL_SECURE),
        // secureConnection: Boolean(process.env.EMAIL_SECURE_CONNECTION),
        // debug: Boolean(process.env.EMAIL_DEBUG),
        // logger: Boolean(process.env.EMAIL_LOGGER),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // tls: {
        //     rejectUnauthorized: Boolean(process.env.EMAIL_UNAUTHORIZED)
        // }
    }

    const emailGmailHost = {
        // host: process.env.EMAIL_HOST_GMAIL,
        service: process.env.EMAIL_SERVICE,
        port: Number(process.env.EMAIL_PORT_GMAIL),
        secure: Boolean(process.env.EMAIL_SECURE),
            // secureConnection: Boolean(process.env.EMAIL_SECURE_CONNECTION),
            // debug: Boolean(process.env.EMAIL_DEBUG),
            // logger: Boolean(process.env.EMAIL_LOGGER),
        auth: {
            user: process.env.EMAIL_USER_GMAIL,
            pass: process.env.EMAIL_PASS_GMAIL
        },
    }

    console.log('userEmail', userEmail)
    console.log('emailObj', userEmail.includes('gmail') ? emailGmailHost : emailHost)
    

    const emailObj = userEmail.includes('gmail') ? emailGmailHost : emailHost

    const transporter = nodemailer.createTransport(emailObj)

    return transporter
}

module.exports = { createMailTransporter }