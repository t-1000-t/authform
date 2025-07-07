const { Notes } = require('../users')
const { Types } = require('mongoose')

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        // Perform deletion operation using the Notes model
        const result = await Notes.findByIdAndDelete({ _id: new Types.ObjectId(id) })

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
