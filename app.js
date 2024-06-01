const express = require('express')
const passport = require('passport')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const config = require('./config/config')
const apiRouter = require('./router/router')

app.use(cors({
  origin: process.env.CLIENT_FRONT_URL,
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

const io = require('socket.io')(server, {
  cors: {
    origin: `${process.env.CLIENT_FRONT_URL}`,
    methods: [ "GET", "POST" ]
  },
  pingInterval: 2000,
  pingTimeout: 5000,
})

io.on('connection', (socket) => {
  console.log("User connected", socket.id);
  socket.emit("me", socket.id);

  socket.on("callUser", (data) => {
    console.log('Call User', data.userToCall);
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    socket.broadcast.emit("callEnded");
  });
});


server.listen(config.port, () => console.log(`Server running on port ${config.port}`))
