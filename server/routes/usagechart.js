// routes/usagechart.js
const express = require('express');
const router = express.Router();
const UsageChart = require('../models/UsageChart');

router.get('/', async (req, res) => {
  try {
    // Find all documents and select only the needed fields
    const usages = await UsageChart.find({}, 'name usage_rate');
    console.log("Fetched usage data:", usages);
    res.json(usages);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ message: 'Server error while fetching usage data' });
  }
});

module.exports = router;
