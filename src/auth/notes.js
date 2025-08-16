const { User, Note } = require('../models')

module.exports = async (req, res) => {
  try {
    const { text, email } = req.body
    const title = 'head note!'

    // Validate input
    if (!email || !text) {
      return res.status(400).json({ message: 'Email and text are not require' })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    const note = await Note.create({ email: user.email, user: user._id, title, text, completed: false })

    const notes = await Note.find({ user: user._id }).lean()

    return res.status(201).json({ 
      message: 'Note created successfully',
      note,
      notes,
    })
  } catch (error) {
    console.error('Error:', error); // Add this line for logging
    res.status(500).json({ message: error.message })
  }
}

