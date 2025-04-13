// src/components/UsageRejectionChart.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Paper,
  useTheme // Import useTheme to access theme colors
} from '@mui/material';
import { fetchUsages } from '../api/apiFeedback';

const UsageRejectionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Get theme object

  // --- Color Change Here ---
  // Use the 'light' variant of the primary theme color for usage
  const usageColor = theme.palette.primary.light; // Changed from .main to .light
  // Keep rejection color as is (or adjust if needed)
  const rejectionColor = theme.palette.warning.light; // Or keep '#ff9800'
  // --- End Color Change ---


  useEffect(() => {
    const getUsageData = async () => {
      try {
        setLoading(true);
        const resData = await fetchUsages();
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

  const MAX_BAR_HEIGHT = 150;

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
    <Paper elevation={2} sx={{ width: '100%', p: 3, mt: 4, borderRadius: 2 }}>
      <Typography variant="h6" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        Service Usage & Rejection Distribution
      </Typography>

      {/* Chart Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          height: MAX_BAR_HEIGHT + 60,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
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
                    gap: 0.5,
                    height: MAX_BAR_HEIGHT,
                 }}
               >
                {/* Usage Bar */}
                <Tooltip title={`Usage: ${service.usageRate.toFixed(1)}%`} placement="top" arrow>
                  <Box
                    sx={{
                      width: { xs: 15, sm: 20, md: 25 },
                      height: usageBarHeight,
                      // Ensure bgcolor uses the updated usageColor variable
                      bgcolor: usageColor,
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        opacity: 0.85,
                        transform: 'translateY(-3px)',
                      }
                    }}
                  />
                </Tooltip>

                {/* Rejection Bar */}
                <Tooltip title={`Rejection: ${service.rejectionRate.toFixed(1)}%`} placement="top" arrow>
                  <Box
                    sx={{
                      width: { xs: 15, sm: 20, md: 25 },
                      height: rejectionBarHeight,
                      bgcolor: rejectionColor, // Uses rejectionColor variable
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        opacity: 0.85,
                        transform: 'translateY(-3px)',
                      }
                    }}
                  />
                </Tooltip>
              </Box>

              {/* Service Name Label */}
              <Typography
                 variant="caption"
                 sx={{
                    mt: 1,
                    fontWeight: 'medium',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    display: 'block'
                  }}
               >
                {service.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
           {/* Ensure legend also uses the updated usageColor variable */}
          <Box sx={{ width: 14, height: 14, bgcolor: usageColor, mr: 1, borderRadius: '2px' }} />
          <Typography variant="body2">Usage Rate</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 14, height: 14, bgcolor: rejectionColor, mr: 1, borderRadius: '2px' }} />
          <Typography variant="body2">Rejection Rate</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsageRejectionChart;