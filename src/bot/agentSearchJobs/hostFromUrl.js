// hostFromUrl.js

module.exports = (url) => {
    try { return new URL(url).host } catch { return '' }
}