const { Users } = require('../users')
const login = require('./login')
const { sendVerifictionMail } = require('../../middleware/sendVerificationMail')
const crypto = require('crypto')

module.exports = async (req, res) => {
  try {
    const body = req.body

    if (body.password && body.email) {
      const user = await new Users({ ...body, password: body.password, email: body.email, emailToken:crypto.randomBytes(64).toString('hex') })

      const result = await user.save()

      sendVerifictionMail(result)

      if (result) {
        // res.status(201).json({ user: result })
        // res.redirect("/dashboard", 301);

        await login(req, res)
      }
    } else {
      res.status(404).json({ message: 'Some required fields missing' })
      // якщо даних немає перерендерити дану сторінку Реєстрації з потрібними ерорами
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
