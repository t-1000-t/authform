const { language } = require('googleapis/build/src/apis/language')
const mongoose = require('mongoose')

const cvBodySchema = new mongoose.Schema(
    {
        title: {
            fullname: {
                type: String,
                require: true,
            },
            posname: {
                type: String,
                require: true
            }
        },
        contacts: {
                email: String,
                linkedin: String,
                location: String,
                language: String,
                img: String
        }
    }
)

module.exports = mongoose.model('CVbody', cvBodySchema)