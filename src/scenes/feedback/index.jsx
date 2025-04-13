// src/scenes/feedback/index.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, CircularProgress, Pagination } from '@mui/material'; // <<< Import Pagination
import Header from '../../components/Header';
import FeedbackTable from '../../components/FeedbackTable';
import { tokens } from '../../theme';

const FeedbackScene = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- State ---
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // <<< State for current page
  const [totalPages, setTotalPages] = useState(0);   // <<< State for total pages
  const itemsPerPage = 10;                           // <<< Items per page limit

  // --- Data Fetching ---
  // Updated to accept page number
  const fetchFeedback = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Ensure port is 5000
      // Add page and limit query parameters to the fetch URL
      const response = await fetch(`${apiUrl}/api/feedback?page=${page}&limit=${itemsPerPage}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setFeedbackData(result.data);
        // Set pagination state from the response
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage); // Ensure state syncs with response
      } else {
        throw new Error('Failed to fetch feedback data or invalid format received.');
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(err.message || 'Failed to load feedback data.');
      setFeedbackData([]); // Clear data on error
      setTotalPages(0); // Reset pages on error
    } finally {
      setIsLoading(false);
    }
  };

  // --- useEffect Hook ---
  // Fetch data for the initial page (page 1) when the component mounts
  useEffect(() => {
    fetchFeedback(1);
  }, []); // Empty dependency array means this runs only once on mount

  // --- Pagination Handler ---
  const handlePageChange = (event, value) => {
    // 'value' is the new page number selected by the user
    fetchFeedback(value); // Fetch data for the new page
    // setCurrentPage(value); // Optional: Update state immediately, or rely on fetchFeedback response
  };

  // --- Render Logic ---
  let content;
  if (isLoading) {
    content = (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    content = (
      <Typography color="error" sx={{ mt: 2 }}>
        Error loading data: {error}
      </Typography>
    );
  } else {
    // Render the table with data for the current page
    content = (
        <FeedbackTable
            feedbackData={feedbackData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage} // Pass pagination info down
        />
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Feedback Monitor"
        subtitle="Viewing AI analysis of user messages"
      />
      <Box mt="20px">
        {content} {/* Render the loading indicator, error message, or the table */}

        {/* --- Pagination Controls --- */}
        {/* Only show pagination if not loading, no error, and more than one page */}
        {!isLoading && !error && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt="20px">
            <Pagination
              count={totalPages}        // Total number of pages
              page={currentPage}        // Current active page
              onChange={handlePageChange} // Function to call when page changes
              color="primary"           // Or "secondary" based on your theme
              showFirstButton           // Optional: Button to go to page 1
              showLastButton            // Optional: Button to go to the last page
            />
          </Box>
        )}
        {/* --- End Pagination Controls --- */}
      </Box>
    </Box>
  );
};

export default FeedbackScene;