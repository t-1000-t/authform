const express = require('express')
const passport = require('passport')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const config = require('./config/config')
const apiRouter = require('./router/router')
const initializeSocket = require('./src/service/sockets/socket')
const { bootBot } = require('./src/bot/bootBot')

app.use(cors({
  // origin: process.env.CLIENT_URL,
  origin: process.env.CLIENT_DOMAIN_URL || process.env.CLIENT_DOMAIN_URL_SUB,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
}))

if (config.mode === 'development') {
  const logger = require('morgan')
  app.use(logger('dev'))
}

require('./db/connectionDB')()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


require('./middleware/passport')(passport)
app.use(passport.initialize())

app.get('/', (_req, res) => {
  res.send('We are on the Web-AuthForm server')
})

app.use('/api', apiRouter) 

// ---- Telegram bot boot (after parsers, before server.listen)

bootBot(app).catch((e) => {
  console.error('Failed to boot Telegram bot:', e)
})

initializeSocket(server)

server.listen(config.port, () => console.log(`Server running on port ${config.port}`))
