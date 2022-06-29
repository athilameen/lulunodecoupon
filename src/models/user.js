const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const Points = require('./points')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "user",
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordExpires: {
        type: Date,
        required: false
    }
},{
    timestamps: true
})

userSchema.virtual('pointsdata', {
    ref: 'Points',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { _id: user._id.toString() },
      'bloguserlogin',
      {expiresIn: maxAge} // 3hrs in sec
    )

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.generateAdminAuthToken = async function () {

    const user = this
    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { _id: user._id.toString() },
      'blogadminlogin',
      {expiresIn: maxAge} // 3hrs in sec
    )

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to logina')
    }

   const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.generatePasswordReset = async function() {

    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; //expires in an hour

    const user = this
    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { _id: user._id.toString() },
      'bloguserlogin',
      {expiresIn: maxAge} // 3hrs in sec
    )

    user.tokens = user.tokens.concat({ token })
    user.resetPasswordExpires = resetPasswordExpires
    await user.save()

    return token

};

// Delete user points when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Points.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User