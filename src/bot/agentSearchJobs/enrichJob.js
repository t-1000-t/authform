// enrichJob.js
const { axios, cheerio } = require('..')
const firstJobPostingFromLD = require('./firstJobPostingFromLD')

module.exports = async (url) => {
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