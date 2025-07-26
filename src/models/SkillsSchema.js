const mongoose = require('mongoose')

const skillsSchema = new mongoose.Schema(
    {
    //   company: { 
    //     name: { type: String, require: true },
    //     link: { type: String },
    //   },
      company: {type: String, require: true},
      task: {type: String, require: true},
      technologies: {type: String, require: true},
      responsibilities: {type: String, require: true},
    }
)

module.exports = mongoose.model('Skills', skillsSchema)