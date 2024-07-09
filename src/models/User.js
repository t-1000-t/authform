const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const userSchema = new Schema(
    {
      id: {
        type: String,
        default: null,
        require: true,
      },
      username: {
        type: String,
        default: '',
        trim: true,
      },
      surname: {
        type: String,
        default: '',
        trim: true,
      },
      email: {
        type: String,
        index: true,
        lowercase: true,
        trim: true,
        match:
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      },
      password: {
        type: String,
        minlength: 6,
      },
      isVerified: {type: Boolean, default: false},
      emailToken: {type: String, default: null},
      idSocketIO: {type: String, default: null},
      message: {
        type: String || Number,
        default: '',
        trim: true
      },
      role: {
        type: String,
        default: 'user'
      },
      idAvatar: {
        type: String,
        default: null,
      },
      token: {
        type: String,
        default: null,
      },
      // name: String,
      // photo: String,
      // googleId: String,
      // facebookId: String,
    },
    {
      timestamps: true,
    },
  )

  userSchema.methods.getPublicFields = function () {
    return {
      userData: {
        id: this.id,
        username: this.username,
        surname: this.surname,
        email: this.email,
        message: this.message,
        idAvatar: this.idAvatar,
        role: this.role,
        isVerified: this.isVerified,
        emailToken: this.emailToken,
        idSocketIO: this.idSocketIO
      },
      token: this.token,
    }
  }
  
  //Saves the user's password hashed (plain text password storage is not good)
  userSchema.pre('save', function (next) {
    const user = this
  
    if ((user.password && this.isModified('password')) || (user.password && this.isNew))
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
  
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err)
  
          user.password = hash
          next()
        })
      })
    else return next()
  })
  
  userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }
  
  userSchema.methods.getJWT = function () {
    const token = jwt.sign(
      {
        id: this.id,
      },
      config.secretJwtKey,
      {
        expiresIn: 130,
      },
    )
  
    this.token = token
    this.save()
    return token
  }
  
  module.exports = mongoose.model('Users', userSchema)