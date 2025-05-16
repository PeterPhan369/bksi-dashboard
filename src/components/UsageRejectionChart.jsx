// src/components/UsageRejectionChart.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Paper,
  useTheme,
  Divider
} from '@mui/material';
// Import commented out as we'll use fake data instead
// import { fetchUsages } from '../api/apiFeedback';

// Fake data for development and testing
const FAKE_USAGE_DATA = [
  {
    _id: "serv001",
    name: "GPT-4",
    usage_rate: 78.5
  },
  {
    _id: "serv002",
    name: "GPT-3.5",
    usage_rate: 85.2
  },
  {
    _id: "serv003",
    name: "Bard",
    usage_rate: 62.8
  },
  {
    _id: "serv004",
    name: "Claude 2",
    usage_rate: 71.3
  },
  {
    _id: "serv005",
    name: "Llama 2",
    usage_rate: 92.1
  },
  {
    _id: "serv006",
    name: "Mistral",
    usage_rate: 68.7
  }
];

// Mock API function
const mockFetchUsages = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(FAKE_USAGE_DATA);
    }, 1200);
  });
};

const UsageRejectionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const usageColor = theme.palette.primary.light;
  const rejectionColor = theme.palette.warning.light;

  useEffect(() => {
    const getUsageData = async () => {
      try {
        setLoading(true);
        // Use mock function instead of actual API call
        const resData = await mockFetchUsages();
        const services = Array.isArray(resData) ? resData : [resData];
        const transformed = services.map(service => ({
          _id: service._id,
          name: service.name,
          usageRate: Number(service.usage_rate) || 0,
          rejectionRate: 100 - (Number(service.usage_rate) || 0)
        }));
        setData(transformed);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch usage data');
        setLoading(false);
        console.error('Error fetching usage data:', err);
      }
    };

    getUsageData();
  }, []);

  const MAX_BAR_HEIGHT = 180; // Increased height for better visualization

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
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
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        p: 4, 
        mt: 4, 
        borderRadius: 2,
        background: `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
      }}
    >
      {/* Enhanced Title Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          fontWeight="bold"
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Service Usage & Rejection Distribution
        </Typography>
        <Divider sx={{ 
          width: '60%', 
          mx: 'auto', 
          my: 2,
          borderColor: theme.palette.divider
        }} />
        <Typography variant="body2" color="text.secondary">
          Visualizing usage and rejection rates across all services
        </Typography>
      </Box>

      {/* Chart Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          height: MAX_BAR_HEIGHT + 60,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
          px: 2, // Add horizontal padding
        }}
      >
        {data.map(service => {
          const usageBarHeight = Math.max(0, (service.usageRate / 100) * MAX_BAR_HEIGHT);
          const rejectionBarHeight = Math.max(0, (service.rejectionRate / 100) * MAX_BAR_HEIGHT);

          return (
            <Box
              key={service._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                maxWidth: 150,
              }}
            >
              {/* Grouped Bars Container */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1, // Increased gap between bars
                  height: MAX_BAR_HEIGHT,
                }}
              >
                {/* Usage Bar */}
                <Tooltip 
                  title={`Usage: ${service.usageRate.toFixed(1)}%`} 
                  placement="top" 
                  arrow
                >
                  <Box
                    sx={{
                      width: { xs: 18, sm: 24, md: 30 }, // Wider bars
                      height: usageBarHeight,
                      bgcolor: usageColor,
                      borderRadius: '6px 6px 0 0', // Rounded corners
                      transition: 'all 0.4s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        opacity: 0.85,
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      }
                    }}
                  />
                </Tooltip>

                {/* Rejection Bar */}
                <Tooltip 
                  title={`Rejection: ${service.rejectionRate.toFixed(1)}%`} 
                  placement="top" 
                  arrow
                >
                  <Box
                    sx={{
                      width: { xs: 18, sm: 24, md: 30 }, // Wider bars
                      height: rejectionBarHeight,
                      bgcolor: rejectionColor,
                      borderRadius: '6px 6px 0 0', // Rounded corners
                      transition: 'all 0.4s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        opacity: 0.85,
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      }
                    }}
                  />
                </Tooltip>
              </Box>

              {/* Service Name Label */}
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  fontWeight: 'medium',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'block',
                  fontSize: '0.85rem', // Larger font size
                }}
              >
                {service.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Enhanced Legend */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4, 
        gap: 5,
        p: 2,
        borderRadius: '8px',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: usageColor, 
            mr: 1.5, 
            borderRadius: '3px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }} />
          <Typography variant="body2" fontWeight="medium">Usage Rate</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: rejectionColor, 
            mr: 1.5, 
            borderRadius: '3px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }} />
          <Typography variant="body2" fontWeight="medium">Rejection Rate</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsageRejectionChart;