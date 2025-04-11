const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  cpu: { type: String, default: '0%' },
  mem: { type: String, default: '0 MB' },
  latency: { type: String, default: '0ms' },
  accuracy: { type: String, default: '0%' },
  availability: { type: String, default: '100%' },
  throughput: { type: String, default: '0 req/s' },
  errorRate: { type: String, default: '0%' },
  driftDetection: { type: String, default: '0' }
});

const instanceSchema = new mongoose.Schema({
  instanceId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Running', 'Stopped', 'Error'],
    default: 'Running'
  },
  metrics: {
    type: metricsSchema,
    default: () => ({})
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const aiServiceSchema = new mongoose.Schema({
  Sname: { 
    type: String, 
    required: [true, 'Service name is required'],
    trim: true
  },
  type: { 
    type: String, 
    enum: ['classification', 'detection', 'segmentation', 'nlp', 'generation', 'recommendation', 'custom'],
    default: 'classification'
  },
  framework: { 
    type: String, 
    enum: ['tensorflow', 'pytorch', 'keras', 'onnx', 'scikit', 'huggingface', 'custom'],
    default: 'tensorflow'
  },
  version: { 
    type: String, 
    required: [true, 'Version is required'],
    default: '1.0'
  },
  description: { 
    type: String,
    default: ''
  },
  replicas: {
    type: Number,
    default: 1
  },
  metrics: {
    type: metricsSchema,
    default: () => ({})
  },
  instances: [instanceSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'maintenance'],
    default: 'inactive'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp when document is updated
aiServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AIService = mongoose.model('AIServices', aiServiceSchema);

module.exports = AIService;