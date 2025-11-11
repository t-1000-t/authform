// src/oembed/oembed.router.js
const express = require('express')
const axios = require('axios')

const router = express.Router()

// Simple URL allowlist (same as your UI)
const SUPPORTED = ['youtube', 'instagram', 'tiktok', 'facebook', 'threads']

// Very small platform detector that mirrors the frontend
function detectPlatform(url) {
  const u = (url || '').trim()
  if (!/^https?:\/\//i.test(u)) return null
  if (/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//i.test(u)) return 'youtube'
  if (/instagram\.com\/(p|reel|reels|tv)\//i.test(u)) return 'instagram'
  if (/tiktok\.com\/@.+\/video\/\d+|(^https?:\/\/(vm|vt)\.tiktok\.com\/)/i.test(u)) return 'tiktok'
  if (/facebook\.com\/.+\/videos\/\d+|m\.facebook\.com\/story\.php|fb\.watch\//i.test(u)) return 'facebook'
  if (/threads\.net\/@.+\/post\//i.test(u)) return 'threads'
  return null
}

// Map oEmbed endpoints (public)
const OEMBED_ENDPOINTS = {
  youtube: (url) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
  instagram: (url) => `https://graph.facebook.com/v10.0/instagram_oembed?url=${encodeURIComponent(url)}`,
  tiktok: (url) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
  facebook: (url) => `https://www.facebook.com/plugins/post/oembed.json/?url=${encodeURIComponent(url)}`,
  threads: (url) => `https://www.threads.net/oembed?url=${encodeURIComponent(url)}`,
}

// GET /api/vload/oembed?url=...
router.get('/oembed', async (req, res) => {
  try {
    const { url } = req.query
    if (!url) return res.status(400).json({ ok: false, message: 'Missing url' })

    const platform = detectPlatform(url)
    if (!platform || !SUPPORTED.includes(platform)) {
      return res.status(400).json({ ok: false, message: 'Unsupported or unrecognized link' })
    }

    const ep = OEMBED_ENDPOINTS[platform]
    if (!ep) return res.status(400).json({ ok: false, message: 'No oEmbed for this platform' })

    let data = {}
    try {
      const { data: d } = await axios.get(ep(url), { timeout: 10_000 })
      data = d || {}
    } catch {
      // oEmbed can fail (rate limits, private posts, etc.). We’ll still return minimal info.
      data = {}
    }

    return res.json({
      ok: true,
      title: data.title ?? null,
      author_name: data.author_name ?? null,
      thumbnail_url: data.thumbnail_url ?? null,
      provider_name: data.provider_name ?? platform,
      html: data.html ?? null,
    })
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
})

// POST /api/vload/urls
// Body: { url, platform, ownerConsent: boolean }
router.post('/urls', async (req, res) => {
  try {
    const { url, platform, ownerConsent } = req.body || {}
    const detected = detectPlatform(url)

    if (!url || !platform || !detected || platform !== detected) {
      return res.status(400).json({ ok: false, message: 'Invalid or mismatched platform/url' })
    }

    // Enforce "safe mode": do not provide any download for YouTube (or other platforms)
    // Return guidance or an embed/open option.
    if (platform === 'youtube') {
      return res.json({
        ok: false,
        policy: 'no-download',
        message:
          'Downloading YouTube videos from third-party services is not permitted here. You can use YouTube Studio to download your own uploads, or open the video in YouTube.',
        openUrl: url,
      })
    }

    // For other platforms, same policy by default (embed/open only).
    return res.json({
      ok: false,
      policy: 'no-download',
      message:
        'This service does not download from social platforms. You can open the link in the app/site or use the embed above.',
      openUrl: url,
    })
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
})

module.exports = router
