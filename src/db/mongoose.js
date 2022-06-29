const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
})