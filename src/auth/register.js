const { Users } = require('../users')
const login = require('./login')
const { sendVerificationMail } = require('../../middleware')
const crypto = require('crypto')
const generateCustomId = require('../service/generateCustomId')

module.exports = async (req, res) => {
  try {
    const body = req.body

    const user = await Users.findOne({ email: body.email })
    if (user) {
      res.status(301).json({ message: "user found! use your password, please" })
      // res.redirect("/", 301)
      return
    }

    if (body.password && body.email) {
      const user = await new Users({ ...body,
         password: body.password,
         email: body.email,
         emailToken:crypto.randomBytes(64).toString('hex'),
         idAvatar: generateCustomId(),
        })

      const result = await user.save()

      sendVerificationMail(result)

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
