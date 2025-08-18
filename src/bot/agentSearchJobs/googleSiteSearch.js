// googleSiteSearch.js
const { axios } = require('..')
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID


module.exports = async ({ host, position, town, country, num = 5 }) => {
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