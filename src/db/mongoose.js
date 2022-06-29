const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://127.0.0.1:27017/lulunod', {
    useNewUrlParser: true,
}).then(() => {
    console.log("DB Connected")
}).catch(() => {
    console.log("DB not Connected")
})