// BOT.js
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const botSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  chatId: { type: Number, required: true },
}, { timestamps: true })

botSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'botTicketNums',
  start_seq: 500,
})

module.exports = mongoose.model('Bot', botSchema)
