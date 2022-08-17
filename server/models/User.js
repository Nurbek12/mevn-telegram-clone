const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: Array,
        default: []
    },
    contacts: {
        type: Array,
        default: []
    },
    registered: {
        type: Boolean,
        default: false
    },
    bio: String,
    usercolor: String,
    username: String,
    verifycode: String,
});

module.exports = mongoose.model('Telegram-User', UserSchema)