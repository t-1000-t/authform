const express = require('express')
const passport = require('passport')
const cors = require('cors')
const app = express()
const config = require('./config/config')
const apiRouter = require('./router/router')

app.use(cors('*'))

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
  res.send('We are on the Web-BallyMullen server')
})

app.use('/api', apiRouter)

app.listen(config.port, () => console.log(`Server running on port ${config.port}`))
