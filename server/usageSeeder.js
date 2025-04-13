// server/usageSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UsageChart = require('./models/UsageChart');

// Load environment variables (adjust the path to your .env file if necessary)
dotenv.config({ path: 'C:/Users/ASUS/OneDrive/Desktop/Workspace/HTML-CSS-JS/bksi-dashboard/index.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully for seeding usage data'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data for usage & rejection chart
const sampleUsageData = [
  {
    name: "ChatGPT Integration",
    description: "AI-powered chatbot for customer support and interactions",
    usage_rate: 87,
  },
  {
    name: "Email Service",
    description: "Handles email notifications and newsletters",
    usage_rate: 65,
  },
  {
    name: "Payment Gateway",
    description: "Processes user payments and subscriptions",
    usage_rate: 75,
  },
  {
    name: "Data Analytics",
    description: "Real-time analytics for user behavior",
    usage_rate: 80,
  },
  {
    name: "Live Chat",
    description: "Enables live customer support chat",
    usage_rate: 55,
  },
];

// Function to import sample data
const importData = async () => {
  try {
    // Clear existing documents from the collection
    await UsageChart.deleteMany();
    // Insert sample data
    await UsageChart.insertMany(sampleUsageData);
    console.log('Sample usage data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing sample usage data: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy existing data
const destroyData = async () => {
  try {
    await UsageChart.deleteMany();
    console.log('All usage data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying usage data: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on the command-line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
