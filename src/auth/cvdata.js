const { Users } = require('../users')
const { CVdata } = require('../users')
const { ObjectId } = require('mongodb')

module.exports = async (req, res) => {
    try {
        const { data , email } = req.body
        const user = await Users.findOne({ email: email })

        if (user) {
            const dataResult = await CVdata.create({ email: user.email, user, data })
            const idData = await CVdata.find({ user: new ObjectId(dataResult.user) }).lean()
            if (dataResult) {
                return res.status(201).json({idData})
            } else {
                return res.status(400).json({ message: 'Invalid data received' })
            }
        }

    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: error.message })
    }
}