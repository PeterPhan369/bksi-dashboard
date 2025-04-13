const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Make sure your .env file is named index.env or adjust path accordingly
require('dotenv').config({ path: 'C:/Users/ASUS/OneDrive/Desktop/Workspace/HTML-CSS-JS/bksi-dashboard/index.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        // Note: useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
        // and no longer needed. You can remove them if using a recent Mongoose version.
        await mongoose.connect(process.env.MONGODB_URI/*, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
         }*/);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Import routes
const aiServiceRoutes = require('./routes/aiServices');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedbackRoutes'); // <<< 1. IMPORT feedback routes
const ratingChart = require('./routes/ratingchart');
const ratingChartRoutes = require('./routes/ratingchart');
const usageChartRoutes = require('./routes/usagechart');

app.use('/api/usages', usageChartRoutes);
app.use('/api/ratings', ratingChartRoutes);
// Use routes
app.use('/api/services', aiServiceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes); // <<< 2. MOUNT feedback routes under /api/feedback
app.use('/api/ratings', ratingChart);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});