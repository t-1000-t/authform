const socketIO = require('socket.io')
const User = require('../../models/User')

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: `${process.env.CLIENT_DOMAIN_URL}`,
      methods: ["GET", "POST"]
    },
    pingInterval: 2000,
    pingTimeout: 5000,
  })

  io.on('connection', (socket) => {
    console.log("User connected", socket.id)
    socket.emit("me", socket.id)

    socket.on('userConnected', (data) => {
      // console.log('data userConnected => ', data)
    })

    socket.on("registerSocket", async (userId) => {
      try {
        const user = await User.findOne({ id: userId })
        if (user) {
          user.idSocketIO = socket.id
          await user.save()

          // Emit event to update all clients about the updated idSocketIO
          io.emit("updateUserSocket", {
            userId: userId,
            idSocketIO: socket.id
          })
        }

      } catch (error) {
        console.error(`Error updating user with socket ID: ${error}`)
      }
    })

    socket.on("callUser", (data) => {
      console.log('Call User', data.userToCall)
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from })
    })

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    })

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id)
      socket.broadcast.emit("callEnded")
    })
  })
}

module.exports = initializeSocket
