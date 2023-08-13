const mongoose = require('mongoose')
const { mongodbUri } = require('../config/config')

const option = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

async function connectionDB() {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongodbUri, option)
    console.log('MongoDB connect...')
  } catch (error) {
    console.log('MongoDB connection error :', error)
    process.exit(1)
  }
}

module.exports = connectionDB
