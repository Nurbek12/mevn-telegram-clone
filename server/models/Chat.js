const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const ChatSchema = new mongoose.Schema({
    members: {
        type: Array,
        default: true
    },
    users: [{
        type: ObjectId,
        ref: 'Telegram-User'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Telegram-Chat', ChatSchema)