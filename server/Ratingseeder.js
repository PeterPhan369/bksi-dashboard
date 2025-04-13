// models/seeders/Ratingseeder.js
const mongoose = require('mongoose');
require('dotenv').config({ path: 'C:/Users/ASUS/OneDrive/Desktop/Workspace/HTML-CSS-JS/bksi-dashboard/index.env' });
const Service = require('./models/Ratingchart'); // Adjust the path to your model

// Array of sample services with ratings
const sampleServices = [
  {
    name: 'ChatGPT Integration',
    description: 'AI-powered chatbot for customer support and interactions',
    thumb_up_rate: 87
  },
  {
    name: 'Document Processing',
    description: 'Automated document analysis and information extraction',
    thumb_up_rate: 92
  },
  {
    name: 'Sentiment Analysis',
    description: 'Analyze customer feedback and social media mentions for sentiment',
    thumb_up_rate: 78
  },
  {
    name: 'Data Visualization',
    description: 'Interactive dashboards and visual representations of data',
    thumb_up_rate: 84
  },
  {
    name: 'Machine Translation',
    description: 'Translate content between multiple languages',
    thumb_up_rate: 73
  },
  {
    name: 'Voice Recognition',
    description: 'Convert spoken language to text in real-time',
    thumb_up_rate: 81
  },
  {
    name: 'Image Analysis',
    description: 'Identify objects, faces, and content in images',
    thumb_up_rate: 76
  },
  {
    name: 'Recommendation Engine',
    description: 'Personalized content and product recommendations',
    thumb_up_rate: 89
  }
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new data
    const seededServices = await Service.insertMany(sampleServices);
    console.log(`Successfully seeded ${seededServices.length} services`);

    console.log('Seeding complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();