// src/agent/agentSearch.js
const { bot } = require('..')
const hostFromUrl = require('./hostFromUrl')
const googleSiteSearch = require('./googleSiteSearch')
const enrichJob = require('./enrichJob')
const buildTelegramHTML = require('./buildTelegramHTML')


const DEFAULT_CHAT_ID = process.env.ADMIN_CHAT_ID // optional: your own chat_id


async function agentSearch(req, res) {
  try {
    const { url = '', position = '', country = '', town = '', num, toTelegram = true, chat_id } = req.body || {}
    const host = hostFromUrl(url)
    const { query, items } = await googleSiteSearch({ host, position, town, country, num: Math.min(Math.max(+num || 5, 1), 10) })

    // Enrich each result (best effort)
    const enriched = []
    for (const it of items) {
      const extra = await enrichJob(it.link)
      enriched.push({ ...it, ...extra })
    }

    // Optionally send to Telegram
    if (toTelegram) {
      const target = chat_id || DEFAULT_CHAT_ID
      if (target) {
        const html = buildTelegramHTML({ query, host, results: enriched })
        try {
          await bot.telegram.sendMessage(target, html, { parse_mode: 'HTML', disable_web_page_preview: false })
        } catch (e) {
          // don’t fail the API if Telegram send fails
          console.error('Telegram send failed:', e?.response?.description || e.message)
        }
      }
    }

    return res.json({ query, host, results: enriched })
  } catch (e) {
    console.error('agentSearch error:', e?.response?.data || e.message)
    return res.status(500).json({ error: 'Agent search failed' })
  }
}

module.exports = agentSearch
