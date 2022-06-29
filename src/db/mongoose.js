require("dotenv").config()
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
}).then(() => {
    console.log("DB Connected")
}).catch(() => {
    console.log("DB not Connected")
})