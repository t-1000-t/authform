const cron = require('node-cron')
const { fetchAmazonJobs } = require('../jobCards')

let tasks = []

function runAmazonJobScraper() {
  if (tasks.length === 0) {
    const timezone = 'Europe/Dublin'

    const run = async () => {
      console.log('⏰ Running Amazon job scraper at', new Date().toISOString())
      try {
        await fetchAmazonJobs()
      } catch (err) {
        console.error('❌ fetchAmazonJobs failed:', err)
      }
    }

    // Every 30 minutes from 07:00–19:30

    // -Runs exactly twice per hour:
    // -at minute 0 (e.g. 07:00, 08:00, 09:00, …)
    // -and minute 30 (e.g. 07:30, 08:30, 09:30, …)
    // const t1 = cron.schedule('0,30 7-19 * * *', run, { timezone })

    // -'*/30 7-19 * * *'
    // -Uses a step value, meaning “every 30 minutes starting at 0.”
    // -It’s more flexible and semantic — if the system ever starts at a non-zero minute, it still aligns to every 30-minute interval (00, 30, 00, 30…).
    // -Easier to adjust — e.g. change to */15 for every 15 minutes.
    // const t1 = cron.schedule('*/30 7-19 * * *', run, { timezone })

    // Every 60 minutes from 07:00–19:00
    const t1 = cron.schedule('0 7-19 * * *', run, { timezone })

    // One last run at 20:00
    const t2 = cron.schedule('0 20 * * *', run, { timezone })

    tasks = [t1, t2]
    console.log('✅ Scheduled: every 30 min 07:00–19:30 + 20:00 (Europe/Dublin)')
  }

  return tasks
}

module.exports = runAmazonJobScraper
