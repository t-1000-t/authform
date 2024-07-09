const express = require('express')
const passport = require('passport')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const config = require('./config/config')
const apiRouter = require('./router/router')
const initializeSocket = require('./src/service/sockets/socket')

app.use(cors({
  // origin: process.env.CLIENT_URL,
  origin: process.env.CLIENT_DOMAIN_URL,
  methods: ["GET", "POST"],
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

app.get('/', (req, res) => {
  res.send('We are on the Web-AuthForm server')
})

app.use('/api', apiRouter)

initializeSocket(server)

server.listen(config.port, () => console.log(`Server running on port ${config.port}`))
