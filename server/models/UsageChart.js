// models/UsageChart.js
const mongoose = require('mongoose');

const UsageChartSchema = new mongoose.Schema({
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
  usage_rate: {
    type: Number,
    required: true,
    default: 50,  // default value (50%)
    min: 0,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('UsageChart', UsageChartSchema);
