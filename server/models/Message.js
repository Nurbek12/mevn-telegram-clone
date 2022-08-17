const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const MessageSchema = new mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: 'Telegram-User'
    },
    chatId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    view: {
        type: Boolean,
        default: false
    },
    date: {
        day: String,
        time: String
    },
    image: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('Telegram-Message', MessageSchema)