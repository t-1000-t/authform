const { CVdata } = require('../users')

module.exports = async (req, res) => { 

    const { email } = req.body
 
 try {
        const user = await CVdata.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
       }

        // const userDataCv = await CVdata.find({ user: new ObjectId(dataResult.user) }).lean()
    if (user) {
        console.log('user', user)
        return res.status(201).json({user: user})
        } else {
        return res.status(400).json({ message: 'Invalid data received' })
        }

    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: error.message })
  }
   
}