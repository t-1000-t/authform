// router.js
const { Router } = require('express')
const { z } = require('zod')
const { fetchPreviewForUrl, patterns } = require('./oembed')
const { getIO } = require('../service/sockets/socket') // OPTIONAL: if you want to emit url events

const router = Router()

// GET /api/oembed?url=...
router.get('/oembed', async (req, res) => {
  const schema = z.object({ url: z.string().url() })
  const parsed = schema.safeParse(req.query)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid url' })

  const { url } = parsed.data
  try {
    const preview = await fetchPreviewForUrl(url)
    if (!preview) return res.status(404).json({ error: 'Preview not available' })
    // Normalize to frontend shape
    return res.json({
      title: preview.title || null,
      author_name: preview.authorName || null,
      thumbnail_url: preview.thumbnailUrl || null,
      provider_name: preview.providerName || preview.platform || null,
      html: preview.htmlEmbed || null, // ensure you sanitize/server-sandbox before passing through!
    })
  } catch (e) {
    console.error('oembed error:', e)
    return res.status(500).json({ error: 'Failed to fetch preview' })
  }
})

// POST /api/url  { url, platform }
router.post('/url', async (req, res) => {
  const schema = z.object({
    url: z.string().url(),
    platform: z.enum(['youtube', 'instagram', 'tiktok', 'facebook', 'threads']),
    // optional hints to enforce policy
    ownerConsent: z.boolean().optional(), // set true only for your own content / explicit permission
    userId: z.string().optional(), // if you want to notify via socket
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, message: 'Bad payload' })

  const { url, platform, ownerConsent, userId } = parsed.data

  // Validate that the URL matches the claimed platform (defense-in-depth)
  const matched = patterns[platform].some((rx) => rx.test(url))
  if (!matched) return res.status(400).json({ ok: false, message: 'URL does not match platform pattern' })

  // Minimal policy gate: only allow if it’s your own content or you have explicit permission.
  // You can swap this for your auth/DB policy (e.g., verify post ownership).
  const ALLOW_DEMO = process.env.ALLOW_DEMO === 'true'
  if (!ownerConsent && !ALLOW_DEMO) {
    return res.status(403).json({
      ok: false,
      message: 'Downloading is restricted. Provide ownerConsent for your own/authorized content.',
    })
  }

  // If you have a url queue, enqueue here. We’ll simulate an immediate “prepared file”.
  // NEVER bypass DRM or violate platform TOS.
  const fakeUrlId = `url_${Date.now()}`
  const fakeSignedUrl = null // or a pre-generated URL to your own file, when you truly own it

  // OPTIONAL: emit socket events
  try {
    const io = getIO?.()
    if (io && userId) {
      io.emit('ulrQueued', { urlId: fakeUrlId, platform, url, userId })
      // Simulate completion event (you’d do this after processing)
      setTimeout(() => {
        io.emit('urlCompleted', {
          urlId: fakeUrlId,
          platform,
          url,
          // only include downloadUrl when allowed and file is YOURS or licensed:
          downloadUrl: fakeSignedUrl,
        })
      }, 300)
    }
  } catch {}

  return res.json({
    ok: true,
    urlId: fakeUrlId,
    // If you actually generated a file for permitted content, return it:
    downloadUrl: fakeSignedUrl || undefined,
    message: fakeSignedUrl
      ? 'File ready'
      : 'Url queued (demo). For third-party content, only show embed/open options per policy.',
  })
})

module.exports = router
