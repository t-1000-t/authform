const { logging } = require('googleapis/build/src/apis/logging')
const { Users } = require('../users')

module.exports = async (req, res) => {
  try {
    const body = req.body
    const user = await Users.findOne({ email: body.email })

    if (user) {
      const passwordCompare = user.validatePassword(body.password)
      console.log('Password comparison result:', passwordCompare) // Add this line for logging

      if (passwordCompare) { // Check if the document is already being saved
  
          user.getJWT()

          try {
            const respondUserData = user.getPublicFields()
            res.send(respondUserData)
          } catch (saveError) {
            console.error('Error during save:', saveError); // Add this line for logging
            res.status(500).json({ message: 'Error saving user data' })
          } finally {
            user.isSaving = false; // Reset the flag after the save operation completes
          }
      } else {
        res.status(404).json({ message: 'Email or password not correct' })
      }
    } else {
      console.log('User not found') // Add this line for logging
      res.status(404).json({ message: 'Email or password not correct' })
    }
  } catch (error) {
    console.error('Error:', error); // Add this line for logging
    res.status(500).json({ message: error.message })
  }
}
