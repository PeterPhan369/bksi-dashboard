// models/Ratingchart.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumb_up_rate: {
    type: Number,
    required: true,
    default: 50, // default value is 50%
    min: 0,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
