const nodemailer = require('nodemailer')

const createMailTransporter = (userEmail) => {

    const emailHost = {
        service: process.env.EMAIL_SERVICE_GMAIL,
        host: process.env.EMAIL_HOST_GMAIL,
        secure: process.env.EMAIL_SECURE_GMAIL,
        port: process.env.EMAIL_PORT_GMAIL,
        auth: {
            user: process.env.EMAIL_USER_GMAIL,
            pass: process.env.EMAIL_PASS_GMAIL
        }
    }

    const transporter = nodemailer.createTransport(emailHost)

    return transporter
}

module.exports = { createMailTransporter }