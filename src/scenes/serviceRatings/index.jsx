// src/scenes/ServiceRatingsScene.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import apiService from '../../api/apiServiceManager';
import AIServiceRatingChart from '../../components/AIServiceRatingChart';
import Header from "../../components/Header";

const ServiceRatings = () => {
  const [serviceNames, setServiceNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService.getServices()
      .then(data => setServiceNames(data.map(s => s.Sname)))
      .catch(() => setError('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress/></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p:4 }}>
      <Header title="Service Ratings" subtitle = "Overall Service Ratings"/>
      <AIServiceRatingChart serviceNames={serviceNames} />
    </Box>
  );
};

export default ServiceRatings;