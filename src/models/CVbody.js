const mongoose = require('mongoose')

const cvBodySchema = new mongoose.Schema(
    {
        about: {
           type: String,
           require: true,
        },
        info: {
                email: String,
                linked: String,
                local: String,
                lang: String,
                img: String
        },
        title: {
            type: String,
            require: true
        }
    }
)

module.exports = mongoose.model('CVbody', cvBodySchema)