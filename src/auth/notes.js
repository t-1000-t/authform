const { Users } = require('../users')
const { Notes } = require('../users')
const { ObjectId } = require('mongodb')

module.exports = async (req, res) => {
  try {
    const { text, email } = req.body
    const user = await Users.findOne({ email: email })
    const title = 'head note!'

    if (user) {
        // console.log('user', user)
        // console.log('title', title)
         // Create and store the new user 
    const note = await Notes.create({ user, title, text, completed: false })

    const notes = await Notes.find({ user: new ObjectId(note.user) }).lean()

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

