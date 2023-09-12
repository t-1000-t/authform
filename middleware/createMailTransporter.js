const nodemailer = require('nodemailer')

const createMailTransporter = () => {


    const transporter = nodemailer.createTransport({
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
    })

    return transporter
}

module.exports = { createMailTransporter }