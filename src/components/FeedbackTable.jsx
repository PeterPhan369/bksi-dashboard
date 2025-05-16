// src/components/FeedbackTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme"; // Adjust path if needed

const FeedbackTable = ({ feedbackData, currentPage, itemsPerPage }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (!feedbackData) {
    return <Typography>Waiting for data...</Typography>;
  }

  if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
    return <Typography>No feedback entries available for this page.</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table stickyHeader aria-label="feedback analysis table">
          <TableHead>
            <TableRow sx={{
              "& .MuiTableCell-head": {
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontWeight: 'bold',
              },
            }}>
              <TableCell sx={{ width: '5%' }}>No.</TableCell>
              <TableCell sx={{ width: '20%' }}>Service Name</TableCell>
              <TableCell sx={{ width: '25%' }}>Date and Time</TableCell>
              <TableCell sx={{ width: '25%' }}>Suggestions</TableCell>
              <TableCell sx={{ width: '25%' }}>User Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackData
              .slice(startIndex, startIndex + itemsPerPage)
              .map((row, index) => (
              <TableRow
                key={row.id || index}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{row.serviceName}</TableCell>
                <TableCell>{row.dateTime}</TableCell>
                <TableCell>{row.suggestions}</TableCell>
                <TableCell>{row.userfeedback || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

FeedbackTable.propTypes = {
  feedbackData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      serviceName: PropTypes.string.isRequired,
      dateTime: PropTypes.string.isRequired,
      suggestions: PropTypes.string.isRequired,
      userfeedback: PropTypes.string,
    })
  ),
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

FeedbackTable.defaultProps = {
  feedbackData: [],
  currentPage: 1,
  itemsPerPage: 10,
};

export default FeedbackTable;