const getListUsers = (User) => async (req, res) => {
    try {
        const usersList = await User.find({}, 'id username surname email isVerified idSocketIO token')

        if (!usersList) {
            return res.status(404).json({message: 'List is not found'})
        }

        res.status(200).json({ list: usersList })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = getListUsers
