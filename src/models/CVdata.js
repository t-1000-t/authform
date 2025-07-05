const mongoose = require('mongoose')


const cvDataSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        data: {
            type: Object,
            required: true,
            ref: 'CVbody'
        },
        email: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('cv', cvDataSchema)