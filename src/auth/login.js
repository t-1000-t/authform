const { Users } = require('../users')

module.exports = async (req, res) => {
  try {
    const body = req.body
    const user = await Users.findOne({ email: body.email })

    if (user) {
      const passwordCompare = user.validatePassword(body.password)

      user.getJWT()

      const respondUserData = user.getPublicFields()
      passwordCompare
        ? res.send(respondUserData)
        : res.status(404).json({ message: 'Email or password not correct' })
      // res.redirect("/dashboard", 301)
    } else {
      // якщо юзера немає перерендерити дану сторінку Авторизації з потрібними ерорами
      res.status(404).json({ message: 'Email or password not correct' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
