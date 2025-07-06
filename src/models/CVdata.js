const mongoose = require('mongoose')


const cvDataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        newData: {
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