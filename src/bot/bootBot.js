// src/bot/bootBot.js
const { wireHandlers } = require('./telegramBot')
const { bot } = require('.')

const PUBLIC_TG_URL = process.env.PUBLIC_TG_URL      // e.g. https://your-heroku-app.herokuapp.com
const WEBHOOK_PATH  = process.env.WEBHOOK_PATH || '/tg/webhook'
const TG_SECRET     = process.env.TG_SECRET

async function bootBot(app) {
  if (!process.env.BOT_TOKEN) {
    console.warn('BOT_TOKEN missing — Telegram bot will not start.')
    return
  }

  // Register handlers (start/help/text...)
  wireHandlers()

  // If PUBLIC_TG_URL is https -> webhook mode (prod). Otherwise -> polling (dev/local).
  const useWebhook = typeof PUBLIC_TG_URL === 'string' && PUBLIC_TG_URL.startsWith('https://')

  if (useWebhook) {
    const webhookUrl = `${PUBLIC_TG_URL}${WEBHOOK_PATH}`

    // Secret header check + forward update to Telegraf
    app.post(
      WEBHOOK_PATH,
      (req, res, next) => {
        const hdr = req.get('X-Telegram-Bot-Api-Secret-Token')
        if (!hdr || hdr !== TG_SECRET) return res.status(401).end()
        next()
      },
      // You can also use: bot.webhookCallback(WEBHOOK_PATH)
      (req, res) => bot.handleUpdate(req.body, res)
    )

    await bot.telegram.setWebhook(webhookUrl, {
      secret_token: TG_SECRET,
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
    })

    console.log('[Telegram] Webhook set to:', webhookUrl)
  } else {
    // Local dev: Telegram requires HTTPS for webhooks, so use polling.
    await bot.telegram.deleteWebhook({ drop_pending_updates: true })
    await bot.launch()
    console.log('[Telegram] Launched in polling mode (no https PUBLIC_TG_URL).')
  }

  // Graceful stop (Heroku etc.)
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

module.exports = { bootBot }
