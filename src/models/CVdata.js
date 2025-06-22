const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const cvDataSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        data: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true,
        },
    }
)

module.exports = mongoose.model('cv', cvDataSchema)