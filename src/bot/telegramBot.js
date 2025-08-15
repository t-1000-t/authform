// bot/telegramBot.js
const { Telegraf, Markup } = require('telegraf')
const axios = require('axios')
const { getIO } = require('../service/sockets/socket') // adjust path if needed

const bot = new Telegraf(process.env.BOT_TOKEN)

async function googleSearch(query, num = 3) {
  const { GOOGLE_API_KEY, GOOGLE_CSE_ID } = process.env
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID')
  }
  const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: { key: GOOGLE_API_KEY, cx: GOOGLE_CSE_ID, q: query, num, safe: 'active' },
    timeout: 10000,
  })
  return (data.items || []).slice(0, num).map((it, i) => ({
    pos: i + 1,
    title: it.title,
    link: it.link,
    snippet: it.snippet || '',
    displayLink: it.displayLink || '',
  }))
}

// ---- Telegraf chat handlers
function wireHandlers() {
  bot.start(async (ctx) => {
    const chatId = ctx.chat.id
    const userId = ctx.from.id
    // console.log(`[TG]/start chat_id=${chatId} user_id=${userId} username=@${ctx.from.username || ''}`)
    await ctx.reply(`Your chat_id is: ${chatId}\n(user_id: ${userId})`)
  })

  bot.command('id', (ctx) => {
    ctx.reply(`chat_id: ${ctx.chat.id}\nuser_id: ${ctx.from.id}`)
  })


  // bot.start((ctx) => ctx.reply('Send me a search query — I’ll Google it.'))
  bot.hears(/^\/help/i, (ctx) => ctx.reply('Just send text to search.'))

  bot.on('text', async (ctx) => {
    const q = (ctx.message.text || '').trim()
    if (!q) return ctx.reply('Please send some text to search.')

    // emit "incoming" event to all connected browsers
    try {
      getIO().emit('tg:incoming', {
        from: { id: ctx.from.id, username: ctx.from.username },
        q,
        at: Date.now(),
      })
    } catch {} // if io not ready, ignore

    const notice = await ctx.reply(`🔎 Searching: ${q}`)
    try {
      const results = await googleSearch(q, 3)

      // emit "results" to browsers
      try {
        getIO().emit('tg:results', {
          from: { id: ctx.from.id, username: ctx.from.username },
          q,
          results,
          at: Date.now(),
        })
      } catch {}

      if (!results.length) return ctx.reply('No results found.')

      let text = `Top results for: *${q}*\n\n`
      for (const r of results) {
        text += `${r.pos}. [${r.title}](${r.link})\n_${r.snippet}_\n\n`
      }
      await ctx.replyWithMarkdown(text, {
        disable_web_page_preview: false,
        reply_markup: Markup.inlineKeyboard(
          results.map((r) => [Markup.button.url(`Open ${r.pos}`, r.link)])
        ),
      })
    } catch (e) {
      console.error(e)
      await ctx.reply('Search failed. Try again.')
    } finally {
      try { await ctx.deleteMessage(notice.message_id) } catch {}
    }
  })
}

// ---- Express handler for /api/foobot
async function telegramBot(req, res) {
  try {
    const { q, num = 3 } = req.body || {}
    const query = (q || '').trim()
    if (!query) return res.status(400).json({ error: 'Missing "q" in body' })

    const results = await googleSearch(query, Math.min(Math.max(+num || 3, 1), 10))
    return res.json({ query, results })
  } catch (e) {
    console.error('foobot error:', e?.response?.data || e.message)
    return res.status(500).json({ error: 'Search failed' })
  }
}

function formatTelegramResults(q, results) {
  let text = `Top results for: *${q}*\n\n`
  for (const r of results) text += `${r.pos}. [${r.title}](${r.link})\n_${r.snippet}_\n\n`
  return text
}

module.exports = { bot, wireHandlers, telegramBot, formatTelegramResults } 
