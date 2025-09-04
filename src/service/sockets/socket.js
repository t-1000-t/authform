// socket.js
const socketIO = require('socket.io')
const User = require('../../models/User')

let io // <-- module-scoped reference

const initializeSocket = (server) => {
  const allowedOrigins = [process.env.CLIENT_DOMAIN_URL, process.env.CLIENT_DOMAIN_URL_SUB].filter(Boolean)

  io = socketIO(server, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true, // allow list or all if not set
      methods: ['GET', 'POST'],
    },
    pingInterval: 2000,
    pingTimeout: 5000,
  })

  io.on('connection', (socket) => {
    console.log('User connected', socket.id)
    socket.emit('me', socket.id)

    socket.on('userConnected', (_data) => {
      // no-op (you can log if you want)
    })

    socket.on('registerSocket', async (userId) => {
      try {
        const user = await User.findOne({ id: userId })
        if (user) {
          user.idSocketIO = socket.id
          await user.save()

          // notify all clients the user's socket ID changed
          io.emit('updateUserSocket', { userId, idSocketIO: socket.id })
        }
      } catch (error) {
        console.error(`Error updating user with socket ID: ${error}`)
      }
    })

    socket.on('callUser', (data) => {
      console.log('Call User', data.userToCall)
      io.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
      })
    })

    socket.on('answerCall', (data) => {
      io.to(data.to).emit('callAccepted', data.signal)
    })

    socket.on('disconnect', async () => {
      console.log('User Disconnected', socket.id)
      socket.broadcast.emit('callEnded')
      // optional: clear mapping in DB
      try {
        await User.updateOne({ idSocketIO: socket.id }, { $unset: { idSocketIO: '' } })
      } catch (e) {
        console.error('Failed to clear idSocketIO:', e)
      }
    })
  })
}

// Accessor for other modules (e.g., telegramBot.js)
const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized yet')
  return io
}

// Optional helper: emit to a specific user by userId (using your DB mapping)
async function emitToUserSocket(userId, event, payload) {
  if (!io) return
  try {
    const user = await User.findOne({ id: userId })
    if (user?.idSocketIO) {
      io.to(user.idSocketIO).emit(event, payload)
    }
  } catch (e) {
    console.error('emitToUserSocket error:', e)
  }
}

module.exports = initializeSocket
module.exports.getIO = getIO
module.exports.emitToUserSocket = emitToUserSocket
