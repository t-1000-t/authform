const { createMailTransporter } = require('./createMailTransporter')

const sendVerifictionMail = (user) => {
    const transporter = createMailTransporter()

    const mailOptions = {
        form: '"AuthForm App" <testenet@ukr.net>',
        to: user.email,
        subject: 'Verify your email...',
        html: `<p>Hello ${user.name}, verify your email by click this link ... </p>
        <a href = '${process.env.CLIENT_URL}/verify?emailToken=${user.emailToken}'>Verify Your Email</a>`,
    }

    transporter.sendMail(mailOptions, () => {
        if (error) {
            console.log(error)
            } else {
            console.log("Verification email sent")
        }
    })
}

module.exports = { sendVerifictionMail }