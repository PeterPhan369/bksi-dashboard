// src/components/AIServiceRatingChart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Stack, Button } from '@mui/material';
import { fetchRatings } from '../api/apiFeedback'; // Adjust the import path as needed

const AIServiceRatingChart = () => {
  const [data, setData] = useState([]); // holds transformed rating data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ratings data on mount
  useEffect(() => {
    const getRatings = async () => {
      try {
        setLoading(true);
        const resData = await fetchRatings();
        // Defensive check: wrap in an array if not already one
        const services = Array.isArray(resData) ? resData : [resData];
        // Transform each service to include id, thumbUp, and thumbDown fields
        const transformed = services.map(service => ({
          _id: service._id, // for deletion
          name: service.name,
          thumbUp: Number(service.thumb_up_rate),
          thumbDown: 100 - Number(service.thumb_up_rate)
        }));
        setData(transformed);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service ratings');
        setLoading(false);
        console.error('Error fetching service ratings:', err);
      }
    };

    getRatings();
  }, []);

  // Delete handler for a given service id using absolute URL
  const handleDelete = async (id) => {
    try {
      // Using the absolute URL to directly target the Express backend
      await axios.delete(`http://localhost:5000/api/ratings/${id}`);
      // Update local state by filtering out the deleted service
      setData(prevData => prevData.filter(service => service._id !== id));
    } catch (err) {
      console.error(`Error deleting service with id ${id}:`, err);
      setError('Failed to delete service');
    }
  };

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
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">{service.name}</Typography>
            <Button 
              variant="contained" 
              color="error" 
              size="small" 
              onClick={() => handleDelete(service._id)}
            >
              Delete
            </Button>
          </Stack>
          <Stack direction="row" spacing={0} sx={{ height: 24, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${service.thumbUp}%`,
                bgcolor: '#4caf50'
              }}
            />
            <Box
              sx={{
                width: `${service.thumbDown}%`,
                bgcolor: '#f44336'
              }}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>
              👍 {service.thumbUp}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#f44336' }}>
              👎 {service.thumbDown}%
            </Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default AIServiceRatingChart;
