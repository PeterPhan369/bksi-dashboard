// feedbackSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Feedback = require('./models/Feedback');

dotenv.config({ path: 'C:/Users/ASUS/OneDrive/Desktop/Workspace/HTML-CSS-JS/bksi-dashboard/index.env' });

// --- Connect to Database ---

mongoose.connect(process.env.MONGODB_URI, {

});

// --- Sample Data for Feedback ---
// --- Sample Data for Feedback ---
const sampleFeedbackData = [
    { initial: "My login doesn't work, please help.", tokenized: "account_login_issue", userfeedback: "good" },
    { initial: "How can I reset my password?", tokenized: "password_reset_query", userfeedback: "bad" },
    { initial: "I think the reporting feature has a bug.", tokenized: "bug_report_reporting", userfeedback: "good" },
    { initial: "Can you explain the billing cycle?", tokenized: "billing_cycle_explanation_request", userfeedback: "bad" },
    { initial: "Thanks for the quick support!", tokenized: "positive_feedback_support", userfeedback: "bad" },
    { initial: "The dashboard is loading very slowly today.", tokenized: "performance_issue_dashboard", userfeedback: "bad" },
    { initial: "How do I update my profile information?", tokenized: "profile_update_inquiry", userfeedback: "bad" },
    { initial: "Where can I find the documentation for the API?", tokenized: "documentation_request_api", userfeedback: "bad" },
    { initial: "Feature request: Can we export data to CSV?", tokenized: "feature_request_export_csv", userfeedback: "bad" },
    { initial: "I'm having trouble connecting my external account.", tokenized: "integration_connection_issue", userfeedback: "bad" },
    { initial: "What are your support hours?", tokenized: "support_hours_inquiry", userfeedback: "bad" },
    { initial: "My payment failed, what should I do?", tokenized: "payment_failed_issue", userfeedback: "good" },
];


// --- Import Data Function ---
const importData = async () => {
    try {
        // Clear existing feedback data
        await Feedback.deleteMany();
        console.log('Existing Feedback data cleared.');

        // Insert sample feedback data
        await Feedback.insertMany(sampleFeedbackData);
        console.log('Sample Feedback data imported successfully!');

        process.exit(); // Exit script with success code
    } catch (error) {
        console.error(`Error importing Feedback data: ${error.message}`);
        process.exit(1); // Exit script with error code
    }
};

// --- Destroy Data Function ---
const destroyData = async () => {
    try {
        // Delete all feedback data
        await Feedback.deleteMany();
        console.log('All Feedback data destroyed successfully!');

        process.exit(); // Exit script with success code
    } catch (error) {
        console.error(`Error destroying Feedback data: ${error.message}`);
        process.exit(1); // Exit script with error code
    }
};

// --- Execution Logic ---
// Check command line arguments to decide whether to import or destroy
if (process.argv[2] === '-d') {
    // If argument is '-d', destroy the data
    destroyData();
} else {
    // Otherwise (no argument or different argument), import the data
    importData();
}