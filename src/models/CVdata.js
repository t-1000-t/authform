const mongoose = require('mongoose')

const CVskills = new mongoose.Schema(
    {
      company: {type: String, require: true},
      task: {type: String, require: true},
      technologies: {type: String, require: true},
      responsibilities: {type: String, require: true},
    }
)

const CVbody = new mongoose.Schema(
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
        competencies: {
                languages: String,
                ide: String,
                vcs: String,
                platform: String,
                tracking: String,
                db: String,
                technologies: String,
            },
        skills: [CVskills],
        pet: {
                own: {type: String, require: true},
                task: {type: String, require: true},
                technologies: {type: String, require: true},
                responsibilities: {type: String, require: true},
            },
        }
    )

const CVdata = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        newData: CVbody,
        email: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('cv', CVdata)