// botChtId.js
const { Bot, User } = require("../models")

module.exports = async (req, res) => {
    try {
        const { chatBotId, email } = req.body
    
        if (!chatBotId || !email) {
            return res.status(400).json({ message: "Chat ID or Email are not require" })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "User not faund" })
        }

        const chatIdNum = Number(chatBotId)
        if (Number.isNaN(chatIdNum)) {
        return res.status(400).json({ message: "chatId must be a number" })
        }

    // upsert behavior: update if exists, otherwise create
    const updated = await Bot.findOneAndUpdate(
      { user: user._id },
      { user: user._id, chatId: chatIdNum, email: user.email },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.status( updated.wasNew ? 201 : 200 ).json({
      message: updated.wasNew ? "Chat ID created" : "Chat ID updated",
      bot: updated,
    })
    } catch(error) {
        console.error('Error:', error); // Add this line for logging
        res.status(500).json({ message: error.message })
    }
}