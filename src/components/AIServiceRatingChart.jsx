// src/components/AIServiceRatingChart.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import { fetchAllServiceRatings } from '../api/apiFeedback';

const SERVICE_NAMES = [
  'serviceA',
  'serviceB',
  'serviceC',
  // …add your actual service_name values here
];

const AIServiceRatingChart = () => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        // Pass in your array of service names here:
        const metrics = await fetchAllServiceRatings(SERVICE_NAMES);
        setData(metrics);
      } catch (err) {
        console.error(err);
        setError('Failed to load feedback metrics');
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        AI Service Rating Distribution
      </Typography>

      {data.map((service) => (
        <Box key={service._id} sx={{ mb: 3, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {service.name}
          </Typography>

          {/* stacked bar */}
          <Stack direction="row" spacing={0} sx={{ height: 24, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: `${service.thumbUp}%`,    bgcolor: '#4caf50' }} />
            <Box sx={{ width: `${service.neutral}%`,    bgcolor: '#ff9800' }} />
            <Box sx={{ width: `${service.thumbDown}%`,  bgcolor: '#f44336' }} />
          </Stack>

          {/* percentages */}
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>👍 {service.thumbUp .toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color: '#ff9800' }}>😐 {service.neutral .toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color: '#f44336' }}>👎 {service.thumbDown .toFixed(1)}%</Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default AIServiceRatingChart;
