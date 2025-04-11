// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AIService = require('./models/AIServices');

// Load env vars
dotenv.config({ path: 'C:/Users/ASUS/OneDrive/Desktop/Workspace/HTML-CSS-JS/bksi-dashboard/index.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data for seeding the database
const sampleServices = [
  {
    Sname: "AI Model A",
    type: "classification",
    framework: "tensorflow",
    version: "2.1",
    description: "Image classification service for product categorization",
    status: "active",
    metrics: {
      cpu: "15%",
      mem: "1.2 GB",
      latency: "0.5ms",
      accuracy: "98%",
      availability: "99.9%",
      throughput: "250 req/s",
      errorRate: "1.5%",
      driftDetection: "0.02",
    },
  },
  {
    Sname: "AI Model B",
    type: "nlp",
    framework: "pytorch",
    version: "1.3",
    description: "NLP model for sentiment analysis",
    status: "active",
    metrics: {
      cpu: "30%",
      mem: "800 MB",
      latency: "0.3ms",
      accuracy: "95%",
      availability: "99.8%",
      throughput: "300 req/s",
      errorRate: "0.5%",
      driftDetection: "0.01",
    },
  },
  {
    Sname: "AI Model C",
    type: "detection",
    framework: "keras",
    version: "1.0",
    description: "Object detection service for security applications",
    status: "maintenance",
    metrics: {
      cpu: "45%",
      mem: "2.5 GB",
      latency: "1.2ms",
      accuracy: "97%",
      availability: "99.5%",
      throughput: "150 req/s",
      errorRate: "2.0%",
      driftDetection: "0.03",
    },
  },
  {
    Sname: "AI Model D",
    type: "segmentation",
    framework: "tensorflow",
    version: "3.0",
    description: "Image segmentation model for medical applications",
    status: "inactive",
    metrics: {
      cpu: "60%",
      mem: "3.2 GB",
      latency: "2.1ms",
      accuracy: "99%",
      availability: "98.5%",
      throughput: "100 req/s",
      errorRate: "0.8%",
      driftDetection: "0.015",
    },
  },
  {
    Sname: "AI Model E",
    type: "generation",
    framework: "huggingface",
    version: "1.5",
    description: "Text generation service for content creation",
    status: "error",
    metrics: {
      cpu: "75%",
      mem: "4.0 GB",
      latency: "3.0ms",
      accuracy: "92%",
      availability: "97.0%",
      throughput: "50 req/s",
      errorRate: "3.5%",
      driftDetection: "0.05",
    },
  },
];

// Import data to DB
const importData = async () => {
  try {
    // Clear existing data
    await AIService.deleteMany();

    // Insert sample data
    await AIService.insertMany(sampleServices);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    await AIService.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}