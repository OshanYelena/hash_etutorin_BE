const { json } = require('body-parser');
const mongoose = require('mongoose');
const { grade_array } = require('../utils/enum');
const { string } = require('joi');


var announcement = new mongoose.Schema({
    announcement: String,
    // date_time: Date
  });

const Class = mongoose.model('Class', new mongoose.Schema({

    grade: {
        type: Number,
        enum: grade_array,
        // required: true
    },
    subject_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        // required: true
    }],
    topic: {
        type: String,
        required: true
    },
    student_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    educator_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    keywords: [{
        type: String,
        // required: true
    }],
    plan_type: {
        type: String,
        enum: ['one_time', 'weekly'],
        // required: true
    },
    class_type: {
        type: String,
        enum: ['individual', 'small_group', 'group'],
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    sub_description: {
        type: String,
        // required: true
    },
    date_time: {
        type: Date,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },

    announcements: [{
        announcement: {
            type: String,
            required: true
        },
        date_time: {
            type: Date,
            default: Date.now
        }
    }],
    resources: [{
        topic: {
            type: String,
            // required: true
        },
        description: {
            type: String,
            // required: true
        },
        resource_link: {
            type: String,
            // required: true
        },
        date_time: {
            type: Date,
            default: Date.now
        },
    }],
    images: [{
        type: String
    }],
    videos: [{
        type: String
    }],
    documents: [{
        type: String
    }]
}));

module.exports = Class;
