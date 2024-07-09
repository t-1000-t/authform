const { Users } = require('../users')
const { Notes } = require('../users')

module.exports = async (req, res) => {
    try {
        // Extract the user's identifier from the request (e.g., email)
        const { email } = req.query

        const user = await Users.findOne({ email: email })

        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }

        const notesUser = await Notes.find({ email: email }).lean()

        // Return the retrieved notes as a response
        res.status(200).json({ notes: notesUser })
      } catch (error) {
        console.error('Error fetching notes:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
}