const { createMailTransporter } = require('./createMailTransporter')

const sendVerificationMail = (user) => {

    console.log('user.email send verification', user.email)
    const transporter = createMailTransporter(user.email)

    const mailOptions = {
        from: 'AuthForm App',
        to: user.email,
        subject: 'Verify your email...',
        html: `<p>Hello ${user.username}, verify your email by click this link verify</p>
        <a href='${process.env.CLIENT_URL}/api/auth/verify/${user.emailToken}'>
            Verify Email</a>
            <p>If you can't click, copy this:</p>
            <p><i>${process.env.CLIENT_URL}/api/auth/verify/${user.emailToken}</i></p>
            <p>and put in your browser address. </p>`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            } else {
            console.log("Verification email sent")
        }
    })
}

module.exports = { sendVerificationMail }