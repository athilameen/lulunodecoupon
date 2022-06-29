const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({

    reciept: {
        type: String,
        trim: true,
        default: null
    },
    points: {
        type: Number,
        default: 0
    },
    ocr_status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Points = mongoose.model('Points', taskSchema)

module.exports = Points