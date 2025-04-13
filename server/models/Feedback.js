// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    initial: {
        type: String,
        required: [true, 'Initial message is required'],
        trim: true
    },
    tokenized: {
        type: String,
        required: [true, 'Tokenized message (purpose) is required'],
        trim: true
    },
    userfeedback: {
        type: String,
        required: [true, 'UserFeedback is required'],
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Mongoose will create a collection named 'feedbacks'
module.exports = mongoose.model('Feedback', feedbackSchema);