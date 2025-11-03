const express = require('express')
const { authRouter } = require('../src/auth')
const { searchRouter } = require('../src/search')
const { fetchAmazonJobs } = require('../src/jobCards')
const { usersRouterFactory, getUser, getListUsers, checkToken } = require('../src/users')
const { User } = require('../src/models')

// Inject User into checkToken here
const checkTokenMiddleware = checkToken(User)

// Create the users router with the necessary dependencies
const usersRouter = usersRouterFactory(checkTokenMiddleware, getUser, getListUsers, User)

const router = express.Router()
router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/search', searchRouter)
router.use('/jobcards', fetchAmazonJobs)
router.use('/rows', () => {})

// Violity search route

// router.get('/search', async (req, res) => {
//     const searchTerm = req.query.query || 'medal';

//     try {
//       const browser = await puppeteer.launch({ headless: true });
//       const page = await browser.newPage();

//       // Set User-Agent and other headers as needed
//       await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

//       await page.goto(`https://violity.com/en/search/result?auction_id=&query=${encodeURIComponent(searchTerm)}&filter=1&phrase=1`, {
//         waitUntil: 'networkidle2',
//       });

//       const content = await page.content();
//       await browser.close();

//       res.send(content);
//     } catch (error) {
//         console.error('Error:', error)
//       res.status(500).send('Error: ' + error.message)
//     }
//   });

module.exports = router
