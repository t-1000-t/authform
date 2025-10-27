const puppeteer = require('puppeteer')

module.exports = async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    const collected = []
    page.on('response', async (resp) => {
      const url = resp.url()
      if (url.includes('appsync-api.eu-west-1.amazonaws.com/graphql')) {
        try {
          const json = await resp.json()
          const jobs = json?.data?.searchJobCardsByLocation?.jobCards
          if (Array.isArray(jobs)) collected.push(...jobs)
        } catch (_) {}
      }
    })

    await page.goto('https://jobs.amazon.ie/app#/jobSearch', {
      waitUntil: 'networkidle2',
    })

    // 👇 wait a bit for network calls to complete
    await new Promise((resolve) => setTimeout(resolve, 2500))

    await browser.close()

    res.json({ count: collected.length, jobs: collected })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).send('Error: ' + err.message)
  }
}
