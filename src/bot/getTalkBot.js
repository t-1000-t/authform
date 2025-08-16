// getTalkBot.js
const { bot } = require('./telegramBot')

async function getTalkBot(req, res) {
    try {
    const { chatId, t, mode } = req.body || {}
    console.log("chatId, t, mode", chatId, t, mode)


    if (!chatId || !t) return res.status(400).json({ error: 'chatId and t require' })
    await bot.telegram.sendMessage(chatId, t, { mode, disable_web_page_preview: false })
    res.json({ ok: true })
  } catch (e) {
    console.error('tg/send error:', e?.response?.data || e.message)
    res.status(500).json({ error: 'Send failed' })
  }
}

module.exports = getTalkBot