// firstJobPostingFromLD.js

module.exports = ($) => {
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