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

  // youtube.com + youtu.be + shorts + studio.youtube.com   // NEW: studio
  if (
    /youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//i.test(u) ||
    /(^https?:\/\/(www\.)?studio\.youtube\.com\/video\/[\w-]{6,}(?:\/[a-z]+)?(?:\?.*)?$)/i.test(u) // NEW
  ) {
    return 'youtube'
  }

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

// GET /api/vdownload/oembed?url=...
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

// POST /api/vdownload/urls
// Body: { url, platform, ownerConsent: boolean }
router.post('/urls', async (req, res) => {
  try {
    const { url, platform, ownerConsent } = req.body || {}
    const detected = detectPlatform(url)

    if (!url || !platform || !detected || platform !== detected) {
      return res.status(400).json({ ok: false, message: 'Invalid or mismatched platform/url' })
    }

    // Helper: extract YouTube video id from various URL shapes
    const getYouTubeId = (u) => {
      try {
        const x = new URL(u)

        // studio.youtube.com/video/VIDEO[/details|/edit]...   // NEW
        if (/^(www\.)?studio\.youtube\.com$/i.test(x.hostname)) {
          const segs = x.pathname.split('/').filter(Boolean) // ['video','VIDEO','details?']
          if (segs[0] === 'video' && segs[1]) return segs[1]
        }

        // youtu.be/VIDEO
        if (x.hostname.includes('youtu.be')) return x.pathname.split('/')[1] || null

        // youtube.com/shorts/VIDEO
        if (/^\/shorts\//i.test(x.pathname)) return x.pathname.split('/')[2] || null

        // youtube.com/watch?v=VIDEO
        if (x.searchParams.get('v')) return x.searchParams.get('v')
      } catch {}
      return null
    }

    if (platform === 'youtube') {
      if (ownerConsent) {
        const vid = getYouTubeId(url)
        // We’re not downloading — we provide the official Studio route for owners.
        return res.json({
          ok: true,
          policy: 'studio-only',
          message: 'Open this video in YouTube Studio to download your own upload.',
          studioUrl: vid ? `https://studio.youtube.com/video/${vid}/edit` : 'https://studio.youtube.com/',
          openUrl: url,
        })
      }
      return res.json({
        ok: false,
        policy: 'no-download',
        message:
          'Downloading YouTube videos from third-party services is not permitted here. Open the video in YouTube.',
        openUrl: url,
      })
    }

    // Other platforms: still no download here
    return res.json({
      ok: false,
      policy: 'no-download',
      message: 'This service does not download from social platforms. Use the platform app/site or the embed.',
      openUrl: url,
    })
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
})

module.exports = router
