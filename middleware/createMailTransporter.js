const nodemailer = require('nodemailer')

const createMailTransporter = () => {

    const emailHost = {
        // service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_DOMEN,
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
        host: process.env.EMAIL_DOMEN_GMAIL,
        // host: process.env.EMAIL_DOMEN,
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

    console.log('email user', process.env.EMAIL_USER)
    console.log('email has "gmail"', process.env.EMAIL_USER.includes('gmail'))

    const transporter = nodemailer.createTransport(emailHost)

    return transporter
}

module.exports = { createMailTransporter }