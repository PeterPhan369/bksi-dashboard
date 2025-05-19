// src/scenes/feedback/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Missing import
import { tokens } from '../../theme';             // Assuming you use custom theme tokens
import Header from '../../components/Header';
import FeedbackTable from '../../components/FeedbackTable'; // Assumes you have this component

const SERVICE_OPTIONS = ['serviceA', 'serviceB', 'serviceC']; // Modify as needed

const FeedbackScene = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- State ---
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // --- Data Fetching ---
  const fetchFeedback = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/feedback?page=${page}&limit=${itemsPerPage}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setFeedbackData(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      } else {
        throw new Error('Failed to fetch feedback data or invalid format received.');
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(err.message || 'Failed to load feedback data.');
      setFeedbackData([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // --- useEffect ---
  useEffect(() => {
    fetchFeedback(1);
  }, []);

  // --- Pagination Handler ---
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchFeedback(value); // Fetch new page
  };

  return (
    <Box m="20px">
      <Header
        title="Feedback Monitor"
        subtitle="Viewing AI analysis of user messages"
      />
      <Box mt="20px">
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <FeedbackTable data={feedbackData} />
        )}

        {/* --- Pagination Controls --- */}
        {!isLoading && !error && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt="20px">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackScene;
