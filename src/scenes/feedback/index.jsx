// src/scenes/FeedbackScene.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import apiService from '../../api/apiServiceManager';
import FeedbackTable from '../../components/FeedbackTable';
import Header from "../../components/Header";

const FeedbackScene = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    apiService.getServices()
      .then(data => setServices(data.map(s => s.Sname)))
      .catch(err => setError('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress/></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p:4 }}>
      <Header title ="Service Feedback" subtitle = "Suggestions from AI Services" />
      <FormControl fullWidth sx={{ mb:3 }}>
        <InputLabel id="service-select-label">Select Service</InputLabel>
        <Select
          labelId="service-select-label"
          value={selectedService}
          label="Select Service"
          onChange={e => setSelectedService(e.target.value)}
        >
          {services.map(name => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedService && (
        <FeedbackTable serviceName={selectedService} itemsPerPage={10} currentPage={1} />
      )}
    </Box>
  );
};

export default FeedbackScene;