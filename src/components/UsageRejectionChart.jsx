// src/components/UsageRejectionChart.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Tooltip, Paper, useTheme, Divider } from '@mui/material';
import { fetchUsages } from '../api/apiFeedback';

const SERVICE_NAMES = [
  'serviceA',
  'serviceB',
  'serviceC',
  // same list as above (or a subset)…
];

const MAX_BAR_HEIGHT = 180;

const UsageRejectionChart = () => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const theme = useTheme();

  const usageColor     = theme.palette.primary.light;
  const rejectionColor = theme.palette.warning.light;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // fan-out one call per service
        const calls = SERVICE_NAMES.map(name => fetchUsages(name));
        const results = await Promise.all(calls);

        // results look like { _id, name, usageRate }
        const transformed = results.map(s => ({
          _id:          s._id,
          name:         s.name,
          usageRate:    s.usageRate,
          rejectionRate: 100 - s.usageRate,
        }));

        setData(transformed);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch usage data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    <Paper elevation={3} sx={{ width: '100%', p: 4, mt: 4, borderRadius: 2, background: `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.background.paper})` }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
        }}>
          Service Usage & Rejection Distribution
        </Typography>
        <Divider sx={{ width: '60%', mx: 'auto', my: 2, borderColor: theme.palette.divider }} />
        <Typography variant="body2" color="text.secondary">
          Visualizing usage and rejection rates across all services
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: MAX_BAR_HEIGHT + 60,
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 1,
        px: 2,
      }}>
        {data.map(service => {
          const uH = Math.max(0, (service.usageRate    / 100) * MAX_BAR_HEIGHT);
          const rH = Math.max(0, (service.rejectionRate / 100) * MAX_BAR_HEIGHT);

          return (
            <Box key={service._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 150 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: MAX_BAR_HEIGHT }}>
                <Tooltip title={`Usage: ${service.usageRate.toFixed(1)}%`} arrow>
                  <Box sx={{
                    width: { xs: 18, sm: 24, md: 30 }, height: uH, bgcolor: usageColor,
                    borderRadius: '6px 6px 0 0', transition: 'all 0.4s ease-in-out', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { opacity: 0.85, transform: 'translateY(-5px) scale(1.05)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                  }} />
                </Tooltip>
                <Tooltip title={`Rejection: ${service.rejectionRate.toFixed(1)}%`} arrow>
                  <Box sx={{
                    width: { xs: 18, sm: 24, md: 30 }, height: rH, bgcolor: rejectionColor,
                    borderRadius: '6px 6px 0 0', transition: 'all 0.4s ease-in-out', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { opacity: 0.85, transform: 'translateY(-5px) scale(1.05)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                  }} />
                </Tooltip>
              </Box>
              <Typography variant="caption" sx={{ mt: 2, fontWeight: 'medium', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                {service.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 5, p: 2, borderRadius: '8px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: usageColor, mr: 1.5, borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
          <Typography variant="body2" fontWeight="medium">Usage Rate</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: rejectionColor, mr: 1.5, borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
          <Typography variant="body2" fontWeight="medium">Rejection Rate</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsageRejectionChart;
