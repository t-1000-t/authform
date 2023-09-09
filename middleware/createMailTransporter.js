const nodemailer = require('nodemailer')

const createMailTransporter = () => {


    const transporter = nodemailer.createTransport({
        // service: process.env.EMAIL_DOMEN,
        host: process.env.EMAIL_DOMEN,
        // port: 465,
        port: 587,
        // secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    return transporter
}

module.exports = { createMailTransporter }