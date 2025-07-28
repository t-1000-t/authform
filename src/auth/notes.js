const { User, Note } = require('../models')
const { Types } = require('mongoose')

module.exports = async (req, res) => {
  try {
    const { text, email } = req.body
    const user = await User.findOne({ email: email })
    const title = 'head note!'

    if (user) { 
    
    const note = await Note.create({ email: user.email, user, title, text, completed: false })

    const notes = await Note.find({ user: new Types.ObjectId(note.user) }).lean()

    if (note) { // Created 
        return res.status(201).json({ notes })
        } else {
            return res.status(400).json({ message: 'Invalid note data received' })
     }
   }

//    if (!notes?.length) {
//      return res.status(400).json({ message: 'No notes found' })
//  }
  } catch (error) {
    console.error('Error:', error); // Add this line for logging
    res.status(500).json({ message: error.message })
  }
}

