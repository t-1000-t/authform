const { Users } = require('../users')
const login = require('./login')
const uuid = require('uuid')
const { sendVerificationMail } = require('../../middleware')
const crypto = require('crypto')
const generateCustomId = require('../service/generateCustomId')

module.exports = async (req, res) => {
  try {
    const body = req.body

    const duplicate = await Users.findOne({ email: body.email }).lean().exec()

    if(duplicate) {
      return res.status(409).json({ message: 'Duplicate username' })
    }

    if (body.password && body.email) {
      const user = await new Users({ ...body,
         id: uuid.v4(),
         password: body.password,
         email: body.email,
         emailToken:crypto.randomBytes(64).toString('hex'),
         idAvatar: generateCustomId(),
         idSocketIO: body.idSocketIO
        })

      const result = await user.save()

      sendVerificationMail(result)

      if (result) {
        // res.status(201).json({ user: result })
        // res.redirect("/dashboard", 301);
      
        await login(req, res)
      }
    } else {
      res.status(400).json({ message: 'Some required fields missing' })
      // якщо даних немає перерендерити дану сторінку Реєстрації з потрібними ерорами
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
