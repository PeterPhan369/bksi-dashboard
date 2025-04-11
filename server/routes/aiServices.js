// server/routes/aiServices.js
const express = require('express');
const router = express.Router();
const AIService = require('../models/AIServices');
const { v4: uuidv4 } = require('uuid');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await AIService.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const { Sname, type, version, replicas = 1 } = req.body;
    
    // Create instances based on replicas count
    const instances = [];
    for (let i = 0; i < replicas; i++) {
      instances.push({
        instanceId: uuidv4(),
        status: 'Running',
        createdAt: Date.now()
      });
    }
    
    const newService = new AIService({
      Sname,
      type,
      version,
      replicas,
      instances
    });
    
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete entire service
router.delete('/:id', async (req, res) => {
  try {
    const service = await AIService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await AIService.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete instance from service
router.delete('/:serviceId/instances/:instanceId', async (req, res) => {
  try {
    const { serviceId, instanceId } = req.params;
    
    const service = await AIService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Remove the instance
    service.instances = service.instances.filter(
      instance => instance.instanceId !== instanceId
    );
    
    // Update replicas count
    service.replicas = service.instances.length;
    
    await service.save();
    
    res.json(service);
  } catch (error) {
    console.error('Error deleting instance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update instance status
router.put('/:serviceId/instances/:instanceId', async (req, res) => {
  try {
    const { serviceId, instanceId } = req.params;
    const { status } = req.body;
    
    const service = await AIService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Find and update the instance
    const instanceIndex = service.instances.findIndex(
      inst => inst.instanceId === instanceId
    );
    
    if (instanceIndex === -1) {
      return res.status(404).json({ message: 'Instance not found' });
    }
    
    service.instances[instanceIndex].status = status;
    await service.save();
    
    res.json(service);
  } catch (error) {
    console.error('Error updating instance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add new instance to service
router.post('/:serviceId/instances', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await AIService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Add new instance
    const newInstance = {
      instanceId: uuidv4(),
      status: 'Running',
      createdAt: Date.now()
    };
    
    service.instances.push(newInstance);
    
    // Update replicas count
    service.replicas = service.instances.length;
    
    await service.save();
    
    res.status(201).json(service);
  } catch (error) {
    console.error('Error adding instance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;