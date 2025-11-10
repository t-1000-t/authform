// services/oembed.js
const { fetch } = require('undici')
const cheerio = require('cheerio')

const SUPPORTED = ['youtube', 'instagram', 'tiktok', 'facebook', 'threads']

// Keep these conservative and readable
const patterns = {
  youtube: [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{6,}(&[\w=&-]+)*$/i,
    /^https?:\/\/(youtu\.be)\/[\w-]{6,}$/i,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{6,}(\?.*)?$/i,
  ],
  instagram: [/^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?/i],
  tiktok: [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+\/?/i,
    /^https?:\/\/(vm|vt)\.tiktok\.com\/[A-Za-z0-9]+\/?$/i,
  ],
  facebook: [
    /^https?:\/\/(www\.)?facebook\.com\/[^/]+\/videos\/\d+\/?/i,
    /^https?:\/\/m\.facebook\.com\/story\.php\?story_fbid=\d+&id=\d+/i,
    /^https?:\/\/fb\.watch\/[A-Za-z0-9_-]+\/?$/i,
  ],
  threads: [/^https?:\/\/(www\.)?threads\.net\/@[\w.-]+\/post\/[A-Za-z0-9_-]+\/?/i],
}

function detectPlatform(url) {
  const u = String(url || '').trim()
  if (!/^https?:\/\//i.test(u)) return null
  return SUPPORTED.find((p) => patterns[p].some((rx) => rx.test(u))) || null
}

/**
 * Try official oEmbed first (when available / allowed).
 * Fallback to simple OpenGraph scrape for title/thumbnail/provider.
 * NOTE: IG/FB oEmbed typically require app tokens; do NOT expose tokens to the client.
 */
async function fetchPreviewForUrl(url) {
  const platform = detectPlatform(url)
  if (!platform) return null

  // --- 1) Try official oEmbed endpoints (YouTube works without auth)
  try {
    const oembed = await tryOEmbed(platform, url)
    if (oembed) return { ...oembed, platform }
  } catch (e) {
    // continue to OG scrape
  }

  // --- 2) Fallback: Open Graph scrape for basic preview
  try {
    const og = await scrapeOpenGraph(url)
    if (og) return { ...og, platform }
  } catch (e) {
    // ignore
  }

  return { platform }
}

async function tryOEmbed(platform, url) {
  // Only implement the ones that are safe without tokens
  if (platform === 'youtube') {
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint, { method: 'GET' })
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      providerName: data.provider_name || 'YouTube',
      htmlEmbed: sanitizeIframeHtml(data.html), // IMPORTANT: sanitize or sandbox
    }
  }

  // For others (IG/FB/TikTok/Threads), official oEmbed may require tokens or be restricted.
  // You can add your server-side app-token logic here (NEVER expose on client).
  return null
}

function sanitizeIframeHtml(html) {
  // Minimal defensive “allowlist-ish” gate. For production, use a real HTML sanitizer.
  if (!html || typeof html !== 'string') return null
  // reject scripts
  if (/<script/i.test(html)) return null
  return html
}

async function scrapeOpenGraph(url) {
  const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) return null
  const raw = await res.text()
  const $ = cheerio.load(raw)

  const get = (sel) => $(sel).attr('content') || null
  const title = get('meta[property="og:title"]') || $('title').text() || null
  const thumbnailUrl = get('meta[property="og:image"]')
  const providerName = get('meta[property="og:site_name"]') || get('meta[name="twitter:site"]') || new URL(url).hostname

  return { title, thumbnailUrl, providerName, authorName: null, htmlEmbed: null }
}

module.exports = {
  detectPlatform,
  patterns,
  fetchPreviewForUrl,
}
