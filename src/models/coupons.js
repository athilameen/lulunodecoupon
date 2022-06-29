const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    couponid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Price'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Coupons = mongoose.model('Coupons', couponSchema)

module.exports = Coupons