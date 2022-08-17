const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const GroupSchema = new mongoose.Schema({
    users: [{
        type: ObjectId,
        ref: 'Telegram-User'
    }],
    members: {
        type: Array,
        default: []
    },
    name: String,
    admin: String,
    avatar: Array,
    bio: String,
    usercolor: String,
    username: String,
});

module.exports = mongoose.model('Telegram-Group', GroupSchema)