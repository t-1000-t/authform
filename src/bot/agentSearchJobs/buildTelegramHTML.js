// buildTelegramHTML.js
const escHtml = require('./escHtml')

module.exports = ({ query, host, results }) => {
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