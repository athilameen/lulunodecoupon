const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://0.0.0.0:27017/blog', {
    useNewUrlParser: true,
})