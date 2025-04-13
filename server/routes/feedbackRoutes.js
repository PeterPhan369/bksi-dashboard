// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Import the model

/**
 * @desc    Get all feedback entries with Pagination
 * @route   GET /api/feedback?page=1&limit=10
 * @access  Public (adjust as needed)
 */
router.get('/', async (req, res) => {
    try {
        // --- Pagination Parameters ---
        // Get page number from query string, default to 1 if not provided
        const page = parseInt(req.query.page) || 1;
        // Get limit (items per page) from query string, default to 10
        const limit = parseInt(req.query.limit) || 10;
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // --- Database Queries ---
        // Get total number of feedback documents for calculating total pages
        const totalEntries = await Feedback.countDocuments();
        // Fetch the paginated documents
        const feedbackEntries = await Feedback.find()
            .sort({ createdAt: -1 }) // Keep sorting by newest first
            .limit(limit)
            .skip(skip);

        // Calculate total pages
        const totalPages = Math.ceil(totalEntries / limit);

        // --- Send Response ---
        res.status(200).json({
            success: true,
            count: feedbackEntries.length, // Number of entries on the current page
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalEntries: totalEntries,
                limit: limit
            },
            data: feedbackEntries
        });
    } catch (error) {
        // Handle errors during fetch
        console.error(`Error fetching feedback: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not fetch feedback data'
        });
    }
});

// Keep other routes (like POST) as they were if needed
router.post('/', async (req, res) => {
    // ... (existing POST logic) ...
     try {
        const { initial, tokenized } = req.body;

        // Basic input validation
        if (!initial || !tokenized) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request: Please provide both initial and tokenized messages'
            });
        }

        // Create new document using the model
        const newFeedback = await Feedback.create({ initial, tokenized });

        // Send successful response (201 Created)
        res.status(201).json({
            success: true,
            data: newFeedback
        });
    } catch (error) {
        // Handle errors during creation
        console.error(`Error creating feedback: ${error.message}`);
        // Specific check for Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        // General server error
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not create feedback entry'
        });
    }
});


module.exports = router;