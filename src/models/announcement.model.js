const mongoose = require('mongoose');

const Announcement = mongoose.model('Announcement', new mongoose.Schema({

    announcement: {
        type: String,
        required: true
    },
    date_time: {
        type: Date,
        // default: Date.now
    }
}));

module.exports = Announcement;
