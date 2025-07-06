const Users = require('../models/User')
const crypto = require('crypto')


const verifyEmail = async (req, res) => {
    try {
        const { emailToken } = req.params

        if (!emailToken) return res.status(404).json("Email Token not found...")

        const user = await Users.findOne({ emailToken })

        // console.log('user Verify', user)

        if (user) {
            // user.emailToken = null
            user.isVerified = true

            await user.save()

            const token = crypto.randomBytes(64).toString('hex')

            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                token,
                isVerified: user?.isVerified
            })
        } else res.status(404).json("Email verification faild, invalid token!")
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports = verifyEmail