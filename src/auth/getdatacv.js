const { CVdata } = require('../users')

module.exports = async (req, res) => { 

    const { email } = req.body

    const user = await CVdata.findOne({ email: email })
    console.log('user data CV', user)

    if (!user) {
       return res.status(404).json({ message: 'User not found' })
    }
}