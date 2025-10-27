const puppeteer = require('puppeteer')
const { bot } = require('../bot')

const DEFAULT_CHAT_ID = process.env.ADMIN_CHAT_ID // optional: your own chat_id

module.exports = async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_PATH || puppeteer.executablePath(),
    })

    const page = await browser.newPage()

    const collected = []
    page.on('response', async (resp) => {
      const url = resp.url()
      if (url.includes('appsync-api.eu-west-1.amazonaws.com/graphql')) {
        try {
          const json = await resp.json()
          const jobs = json?.data?.searchJobCardsByLocation?.jobCards
          if (Array.isArray(jobs)) collected.push(...jobs)
        } catch (_) {}
      }
    })

    await page.goto('https://jobs.amazon.ie/app#/jobSearch', {
      waitUntil: 'networkidle2',
    })

    // 👇 wait a bit for network calls to complete
    await new Promise((resolve) => setTimeout(resolve, 2500))

    await browser.close()

    const target = DEFAULT_CHAT_ID

    // build API response first
    // const payload = { count: collected.length, jobs: collected }
    // res.json(payload)

    // optional Telegram notify
    if (target) {
      try {
        if (collected.length === 0) {
          // either skip entirely:
          // return
          // ...or send a friendly note:
          await bot.telegram.sendMessage(target, 'No new jobs found this run.', {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          })
        } else {
          // format a readable message (string, not array)
          const body = collected
            .map((j, i) => {
              const title = j.title || j.jobTitle || 'Untitled'
              const loc = j.location || j.city || ''
              const url = j.jobUrl || j.href || ''
              const header = url ? `<a href="${url}">${title}</a>` : title
              return `${i + 1}. ${header}${loc ? ` — ${loc}` : ''}`
            })
            .join('\n')

          await bot.telegram.sendMessage(target, `Found ${collected.length} job(s):\n\n${body}`, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          })
        }
      } catch (e) {
        console.error('Telegram send failed:', e?.response?.description || e.message)
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
