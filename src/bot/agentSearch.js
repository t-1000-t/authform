// src/agent/agentSearch.js
const { bot, axios, cheerio } = require('.')

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID
const DEFAULT_CHAT_ID = process.env.ADMIN_CHAT_ID // optional: your own chat_id

function escHtml(s='') {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function hostFromUrl(url) {
  try { return new URL(url).host } catch { return '' }
}

async function googleSiteSearch({ host, position, town, country, num = 5 }) {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID')
  }
  const q = [
    position || '',
    town || '',
    country || '',
    host ? `site:${host}` : '',
  ].filter(Boolean).join(' ').trim()

  const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: {
      key: GOOGLE_API_KEY, cx: GOOGLE_CSE_ID, q,
      num, safe: 'active', gl: 'ie', lr: 'lang_en', hl: 'en',
    },
    timeout: 12000,
  })
  const items = (data.items || []).slice(0, num).map((it, i) => ({
    pos: i + 1,
    title: it.title,
    link: it.link,
    snippet: it.snippet || '',
    displayLink: it.displayLink || '',
  }))
  return { query: q, items }
}

function firstJobPostingFromLD($) {
  const posts = []
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).contents().text()
      if (!raw) return
      const json = JSON.parse(raw)
      const list = Array.isArray(json) ? json : [json]
      for (const node of list) {
        // walk nested @graph arrays too
        const graph = node['@graph']
        if (Array.isArray(graph)) list.push(...graph)
        const type = node['@type']
        if (!type) continue
        const t = Array.isArray(type) ? type : [type]
        if (t.includes('JobPosting')) posts.push(node)
      }
    } catch {}
  })
  return posts[0] || null
}

async function enrichJob(url) {
  try {
    const { data: html } = await axios.get(url, { timeout: 12000, headers: { 'User-Agent': 'Mozilla/5.0' } })
    const $ = cheerio.load(html)

    // Try semantic data first
    const jp = firstJobPostingFromLD($)
    if (jp) {
      const loc = jp.jobLocation && (Array.isArray(jp.jobLocation) ? jp.jobLocation[0] : jp.jobLocation)
      const salary = jp.baseSalary && (jp.baseSalary.value?.value || jp.baseSalary.value?.minValue || jp.baseSalary.value)
      return {
        title: jp.title || $('meta[property="og:title"]').attr('content') || $('title').text().trim(),
        company: jp.hiringOrganization?.name || '',
        location: loc?.address?.addressLocality || loc?.address?.addressRegion || '',
        salary: salary ? String(salary) : '',
        datePosted: jp.datePosted || '',
        employmentType: jp.employmentType || '',
        description: (jp.description || $('meta[name="description"]').attr('content') || '').replace(/\s+/g,' ').trim(),
      }
    }

    // Fallback: OG/meta
    return {
      title: $('meta[property="og:title"]').attr('content') || $('title').text().trim(),
      company: $('meta[name="company"]').attr('content') || '',
      location: $('meta[name="job_location"]').attr('content') || '',
      salary: $('meta[name="salary"]').attr('content') || '',
      datePosted: $('meta[name="datePosted"]').attr('content') || '',
      employmentType: $('meta[name="employmentType"]').attr('content') || '',
      description: ($('meta[name="description"]').attr('content') || '').replace(/\s+/g,' ').trim(),
    }
  } catch (e) {
    return { error: e.message }
  }
}

function buildTelegramHTML({ query, host, results }) {
  let out = `<b>Job search</b>: ${escHtml(query)}\n`
  if (host) out += `site: ${escHtml(host)}\n`
  out += '\n'
  for (const r of results) {
    out += `${r.pos}. <a href="${escHtml(r.link)}">${escHtml(r.title || r.link)}</a>\n`
    if (r.company) out += `• Company: ${escHtml(r.company)}\n`
    if (r.location) out += `• Location: ${escHtml(r.location)}\n`
    if (r.salary) out += `• Salary: ${escHtml(r.salary)}\n`
    if (r.employmentType) out += `• Type: ${escHtml(r.employmentType)}\n`
    if (r.datePosted) out += `• Posted: ${escHtml(r.datePosted)}\n`
    out += '\n'
  }
  return out
}

async function agentSearch(req, res) {
  try {
    const { url = '', position = '', country = '', town = '', num = 5, toTelegram = true, chat_id } = req.body || {}
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
