// src/scenes/feedback/index.jsx
import React, { useState } from 'react';
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
import Header from '../../components/Header';
import FeedbackTable from '../../components/FeedbackTable';

const SERVICE_OPTIONS = ['serviceA', 'serviceB', 'serviceC']; // Modify as needed

const FeedbackScene = () => {
  const [serviceName, setServiceName] = useState(SERVICE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleServiceChange = (event) => {
    setServiceName(event.target.value);
    setCurrentPage(1); // Reset to first page when service changes
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px">
      <Header title="Feedback Monitor" subtitle="Viewing user suggestions by service" />

      <Box mt={2} mb={3} maxWidth={300}>
        <FormControl fullWidth>
          <InputLabel>Service</InputLabel>
          <Select value={serviceName} onChange={handleServiceChange} label="Service">
            {SERVICE_OPTIONS.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <FeedbackTable
        serviceName={serviceName}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={10} // Show 10 pages max — can be made dynamic if desired
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default FeedbackScene;
