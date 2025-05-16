// src/components/AIServiceRatingChart.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Stack, Button, Snackbar, Alert } from '@mui/material';

// Fake ratings data with neutral ratings included
const FAKE_RATINGS_DATA = [
  {
    _id: "rat001",
    name: "GPT",
    thumb_up_rate: 67,
    neutral_rate: 20,
  },
  {
    _id: "rat002",
    name: "Bard",
    thumb_up_rate: 72,
    neutral_rate: 20,
  },
  {
    _id: "rat003", 
    name: "Llama",
    thumb_up_rate: 53,
    neutral_rate: 20,
  }
];

const AIServiceRatingChart = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Load fake ratings data with a small delay to simulate API call
  useEffect(() => {
    const getFakeRatings = () => {
      setTimeout(() => {
        try {
          // Transform each service to include id, thumbUp, neutral, and thumbDown fields
          const transformed = FAKE_RATINGS_DATA.map(service => ({
            _id: service._id,
            name: service.name,
            thumbUp: Number(service.thumb_up_rate),
            neutral: Number(service.neutral_rate),
            thumbDown: 100 - Number(service.thumb_up_rate) - Number(service.neutral_rate)
          }));
          setData(transformed);
          setLoading(false);
        } catch (err) {
          setError('Failed to load service ratings');
          setLoading(false);
          console.error('Error loading service ratings:', err);
        }
      }, 800); // 800ms delay to simulate network request
    };

    getFakeRatings();
  }, []);

  // Delete handler for a given service id
  const handleDelete = async (id) => {
    try {
      // No actual API call, just update the local state
      setData(prevData => prevData.filter(service => service._id !== id));
      
      // Show success notification
      setNotification({
        open: true,
        message: "Service rating deleted successfully",
        severity: "success"
      });
    } catch (err) {
      console.error(`Error deleting service with id ${id}:`, err);
      setNotification({
        open: true,
        message: "Failed to delete service rating",
        severity: "error"
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
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
      
      {data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No service ratings available</Typography>
        </Box>
      ) : (
        data.map((service) => (
          <Box key={service._id} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 1, bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{service.name}</Typography>
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
                  bgcolor: '#4caf50',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
              <Box
                sx={{
                  width: `${service.neutral}%`,
                  bgcolor: '#ffb74d',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
              <Box
                sx={{
                  width: `${service.thumbDown}%`,
                  bgcolor: '#f44336',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                👍 {service.thumbUp}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#ffb74d', fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                😐 {service.neutral}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                👎 {service.thumbDown}%
              </Typography>
            </Stack>
          </Box>
        ))
      )}
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIServiceRatingChart;