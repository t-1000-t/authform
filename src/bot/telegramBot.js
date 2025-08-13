// telegram/telegramBot.js
const { Telegraf, Markup } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN)

// --- Google CSE bits
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID

async function googleSearch(query) {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID')
  }
  const url = 'https://www.googleapis.com/customsearch/v1'
  const { data } = await axios.get(url, {
    params: { key: GOOGLE_API_KEY, cx: GOOGLE_CSE_ID, q: query, num: 5, safe: 'active' },
    timeout: 10000,
  })
  const items = (data.items || []).slice(0, 3)
  return items.map((it, idx) => ({
    title: it.title,
    link: it.link,
    snippet: it.snippet || '',
    pos: idx + 1,
  }))
}

// --- Handlers
function wireHandlers() {
  bot.start((ctx) => ctx.reply(
    'Hey! Send me a search query (e.g. "best bikes Dublin") and I’ll Google it for you.'
  ))

  bot.hears(/^\/help/i, (ctx) =>
    ctx.reply('Just send me your search terms. I’ll reply with top results.'))

  bot.on('text', async (ctx) => {
    const q = (ctx.message.text || '').trim()
    if (!q) return ctx.reply('Please send some text to search.')

    const notice = await ctx.reply(`🔎 Searching: ${q}`)
    try {
      const results = await googleSearch(q)
      if (results.length === 0) {
        return ctx.reply('No results found. Try rephrasing?')
      }

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
    } catch (err) {
      console.error('Search error:', err?.response?.data || err.message)
      await ctx.reply('Sorry, search failed. Try again in a moment.')
    } finally {
      // clean “Searching…” message
      try { await ctx.deleteMessage(notice.message_id) } catch (_) {}
    }
  })
}

module.exports = { bot, wireHandlers }
