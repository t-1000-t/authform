const { CVdata } = require('../models')
const { Types } = require('mongoose')

module.exports = async (req, res) => {

      const { cvId, skillId } = req.params

    try {

        const updatedCV = await CVdata.findByIdAndUpdate(
            cvId,
            { $pull: { 'newData.skills': { _id: new Types.ObjectId(skillId) } } },  // remove mathing skill
            { new: true } // return update document
        )

        if (updatedCV) {
            res.status(200).json({message: "skill has deleted sucsessfull"})
        }
        if (!updatedCV) {
            throw new Error('CV not found or skill not found')
        }

        return updatedCV

    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: error.message })
    }
}