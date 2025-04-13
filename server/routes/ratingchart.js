// routes/ratingchart.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Ratingchart');

// GET route (already implemented)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({}, 'name thumb_up_rate');
    res.json(services);
  } catch (error) {
    console.error('Error fetching service ratings:', error);
    res.status(500).json({ message: 'Server error while fetching service ratings' });
  }
});

// DELETE route: Delete a service by its ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
});

module.exports = router;
