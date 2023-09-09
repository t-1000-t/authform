const { createMailTransporter } = require('./createMailTransporter')

const sendVerifictionMail = (user) => {
    const transporter = createMailTransporter()

    // console.log('user - ', user)

    const mailOptions = {
        from: '"AuthForm App" <admin@ballybar.site>',
        to: user.email,
        subject: 'Verify your email...',
        html: `<p>Hello ${user.username}, verify your email by click this link ... </p>
        <a href='${process.env.CLIENT_URL}/verify/${user.emailToken}'>Verify Your Email</a>`,
    }

    // console.log('mailOptions', mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            } else {
            console.log("Verification email sent")
        }
    })
}

module.exports = { sendVerifictionMail }