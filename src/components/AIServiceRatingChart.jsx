// src/components/AIServiceRatingChart.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import { fetchAllServiceRatings } from '../api/apiFeedback';

const AIServiceRatingChart = ({ serviceNames = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceNames.length) return;
    setLoading(true);
    fetchAllServiceRatings(serviceNames)
      .then(metrics => setData(metrics))
      .catch(() => setError('Failed to load feedback metrics'))
      .finally(() => setLoading(false));
  }, [serviceNames]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress/></Box>;
  if (error) return <Box sx={{ p:3, textAlign:'center' }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        AI Service Rating Distribution
      </Typography>
      {data.map(service => (
        <Box key={service.name} sx={{ mb: 3, p:1, border:'1px solid #ccc', borderRadius:1 }}>
          <Typography variant="subtitle1" sx={{ mb:1 }}>{service.name}</Typography>
          <Stack direction="row" spacing={0} sx={{ height:24, width:'100%', borderRadius:1, overflow:'hidden' }}>
            <Box sx={{ width:`${service.thumbUp}%`, bgcolor:'#4caf50' }}/>
            <Box sx={{ width:`${service.neutral}%`, bgcolor:'#9e9e9e' }}/>
            <Box sx={{ width:`${service.thumbDown}%`, bgcolor:'#f44336' }}/>
          </Stack>
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{ color:'#4caf50' }}>👍 {service.thumbUp.toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color:'#9e9e9e' }}>😐 {service.neutral.toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color:'#f44336' }}>👎 {service.thumbDown.toFixed(1)}%</Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default AIServiceRatingChart;