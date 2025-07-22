const { Users } = require('../users')
const { CVdata } = require('../users')

module.exports = async (req, res) => {
    try {
        const { newData , email } = req.body
        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

       // Update existing CVdata OR insert new if not exists (upsert)
        const updatedCV = await CVdata.findOneAndUpdate(
            { userId: user._id }, // find by userId
            {
                $set: {
                    email: user.email, userId: user._id, newData: newData 
                }, // update this
            },
            { upsert: true, new: true, setDefaultsOnInsert: true } // options
        )

        return res.status(200).json({ message: 'CV saved successfully', data: updatedCV })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: error.message })
    }
}