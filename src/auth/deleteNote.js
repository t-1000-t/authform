const { Notes } = require('../users')
const { ObjectId } = require('mongodb')

module.exports = async (req, res) => {
    try {
        const { noteId } = req.params;

        // Perform deletion operation using the Notes model
        const result = await Notes.deleteOne({ _id: new ObjectId(noteId) })

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Note deleted successfully" })
        } else {
            res.status(404).json({ message: "Note not found" })
        }
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: error.message })
    }
}
