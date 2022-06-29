//require("dotenv").config()
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//process.env.DATABASE

mongoose.connect('mongodb+srv://delunodeusr:YAeBE3zQuWbxrD4F@cluster0.ckaxj.mongodb.net/lulunod', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})