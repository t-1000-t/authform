const nodemailer = require('nodemailer')

const createMailTransporter = (userEmail) => {

    const emailHost = {
        // service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        // host: process.env.EMAIL_HOST_SPF,
        port: Number(process.env.EMAIL_PORT_GMAIL),
        // secure: Boolean(process.env.EMAIL_SECURE),
        // secureConnection: Boolean(process.env.EMAIL_SECURE_CONNECTION),
        // debug: Boolean(process.env.EMAIL_DEBUG),
        // logger: Boolean(process.env.EMAIL_LOGGER),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }

    const emailGmailHost = {
        // host: process.env.EMAIL_HOST_GMAIL,
        host: process.env.EMAIL_HOST,
        // host: process.env.EMAIL_HOST_SPF,
        // service: String(process.env.EMAIL_SERVICE),
        port: Number(process.env.EMAIL_PORT_GMAIL),
        secure: Boolean(process.env.EMAIL_SECURE),
        // secureConnection: Boolean(process.env.EMAIL_SECURE_CONNECTION),
        // debug: Boolean(process.env.EMAIL_DEBUG),
        // logger: Boolean(process.env.EMAIL_LOGGER),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            // user: process.env.EMAIL_USER_GMAIL,
            // pass: process.env.EMAIL_PASS_GMAIL
        },
         tls: {
            rejectUnauthorized: Boolean(process.env.EMAIL_UNAUTHORIZED)
        }
    }

    // console.log('userEmail', userEmail)
    // console.log(`'${userEmail.includes('gmail') ? 'emailGmailHost' : 'emailHost'}`, userEmail.includes('gmail') ? emailGmailHost : emailHost)
    

    // const emailObj = userEmail.includes('gmail') ? emailGmailHost : emailHost

    // const transporter = nodemailer.createTransport(emailObj)
    const transporter = nodemailer.createTransport(emailHost)

    return transporter
}

module.exports = { createMailTransporter }