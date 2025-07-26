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
                languages: String,
                img: String
        },
        education: {
                diploma: String,
                course: String,
        },
        skills: {
                type: Object,
                ref: 'Skills',
            },
    }
)

module.exports = mongoose.model('CVbody', cvBodySchema)