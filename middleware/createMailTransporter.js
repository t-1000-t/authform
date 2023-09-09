const nodemailer = require('nodemailer')

const createMailTransporter = () => {


    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_DOMEN,
        port: 465,
        // port: 527,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    return transporter
}

module.exports = { createMailTransporter }