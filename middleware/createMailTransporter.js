const nodemailer = require('nodemairel')

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        servise: "hotmail",
        auth: {
            user: "testenet@ukr.net",
            pass: process.env.EMAIL_PASS
        }
    })

    return transporter
}

module.exports = { createMailTransporter }