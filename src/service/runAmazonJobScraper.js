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
    const t1 = cron.schedule('0,30 7-19 * * *', run, { timezone })

    // Every 60 minutes from 07:00–19:00
    // const t1 = cron.schedule('0,30 7-19 * * *', run, { timezone })

    // One last run at 20:00
    const t2 = cron.schedule('0 20 * * *', run, { timezone })

    tasks = [t1, t2]
    console.log('✅ Scheduled: every 30 min 07:00–19:30 + 20:00 (Europe/Dublin)')
  }

  return tasks
}

module.exports = runAmazonJobScraper
