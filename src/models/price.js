const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
},{
    timestamps: true
})

const Prices = mongoose.model('Prices', priceSchema)

module.exports = Prices