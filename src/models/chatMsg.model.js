const mongoose = require('mongoose');

const chatMsg = mongoose.model('ChatMsg', new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
));

module.exports = chatMsg;
