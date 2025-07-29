const { User } = require('../models')

module.exports = async (req, res) => {
  try {
    const body = req.body
    const user = await Users.findOne({ id: body.userId })

    if (user) {
      // Invalidate the user's token here
      user.token = null // Set the token to null or remove it from the user object
      user.idSocketIO = null

      // Save the user object to persist the changes
      await user.save()

      res.status(200).json({ message: 'Logged out successfully' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: error.message })
  }
}
