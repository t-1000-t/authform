const { Users } = require('../users')

module.exports = async (req, res) => {
  try {
    const body = req.body
    const user = await Users.findOne({ email: body.email })

    if (user) {
      const passwordCompare = user.validatePassword(body.password)
      // Add this line for logging

      user.getJWT()

      const respondUserData = user.getPublicFields()

      passwordCompare
        ? res.send(respondUserData)
        : res.status(404).json({ message: 'Email or password not correct' })

    } else {
      console.log('User not found'); // Add this line for logging
      res.status(404).json({ message: 'Email or password not correct' })
    }
  } catch (error) {
    console.error('Error:', error); // Add this line for logging
    res.status(500).json({ message: error.message })
  }
}

