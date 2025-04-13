// src/scenes/serviceRatings/index.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import AIServiceRatingChart from '../../components/AIServiceRatingChart';

const ServiceRatings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box m="20px">
      <Header title="SERVICE RATINGS" subtitle="AI Services Approval Ratings" />
      
      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        p="15px"
        backgroundColor={colors.primary[400]}
      >
        <AIServiceRatingChart />
      </Box>
    </Box>
  );
};

export default ServiceRatings;