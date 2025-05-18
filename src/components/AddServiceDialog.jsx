import React, { useState, useEffect } from 'react';
import { addService } from '../api/apiServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AddServiceDialog = ({ open, onClose, onServiceAdded }) => {
  const [serviceName, setServiceName] = useState('');
  const [instances, setInstances] = useState([{ host: '127.0.0.1', port: '' }]);
  const [selectedMetrics, setSelectedMetrics] = useState({
    ai_request_total: false,
    ai_request_latency_seconds: false,
    model_inferences_total: false,
    model_inference_errors_total: false,
    model_response_time_seconds: false,
    model_batch_size: false,
    model_input_data_size_bytes: false,
    model_output_data_size_bytes: false,
    model_input_tokens_total: false,
    model_output_tokens_total: false,
    ai_model_accuracy: false,
    ai_model_loss: false,
    ai_memory_usage_bytes: false,
    ai_cpu_usage_percent: false,
    ai_gpu_memory_usage_bytes: false,
    ai_gpu_utilization_percent: false
  });

  const [nameError, setNameError] = useState('');
  const [instanceErrors, setInstanceErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInstanceErrors(instances.map(() => ({ host: '', port: '' })));
  }, [instances.length]);

  const handleAddInstance = () => {
    setInstances([...instances, { host: '127.0.0.1', port: '' }]);
    setInstanceErrors([...instanceErrors, { host: '', port: '' }]);
  };

  const handleRemoveInstance = (index) => {
    if (instances.length > 1) {
      const updatedInstances = [...instances];
      updatedInstances.splice(index, 1);
      setInstances(updatedInstances);

      const updatedErrors = [...instanceErrors];
      updatedErrors.splice(index, 1);
      setInstanceErrors(updatedErrors);
    }
  };

  const handleInstanceChange = (index, field, value) => {
    const updatedInstances = [...instances];
    updatedInstances[index][field] = value;
    setInstances(updatedInstances);

    const updatedErrors = [...instanceErrors];
    updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
    setInstanceErrors(updatedErrors);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetrics({ ...selectedMetrics, [metric]: !selectedMetrics[metric] });
  };

  const validateForm = () => {
    let isValid = true;
    if (!serviceName.trim()) {
      setNameError('Service name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    const errors = instances.map(instance => {
      const error = { host: '', port: '' };
      if (!instance.host) {
        error.host = 'Host is required';
        isValid = false;
      }
      if (!instance.port) {
        error.port = 'Port is required';
        isValid = false;
      } else if (!/^\d+$/.test(instance.port) || parseInt(instance.port) < 1 || parseInt(instance.port) > 65535) {
        error.port = 'Port must be a number between 1-65535';
        isValid = false;
      }
      return error;
    });

    setInstanceErrors(errors);
    return isValid;
  };

  const handleReset = () => {
    setServiceName('');
    setInstances([{ host: '127.0.0.1', port: '' }]);
    setSelectedMetrics(Object.fromEntries(Object.keys(selectedMetrics).map(key => [key, false])));
    setNameError('');
    setInstanceErrors([{ host: '', port: '' }]);
  };

  const getSelectedMetricsArray = () => {
    return Object.entries(selectedMetrics)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const serviceData = {
        name: serviceName,
        hosts: instances.map(i => i.host),
        ports: instances.map(i => i.port),
        endPoint: '/process',
        replicas: instances.length,
        metrics: getSelectedMetricsArray()
      };
      const response = await addService(serviceData);
      if (response?.status === 'success') {
        onServiceAdded();
        handleReset();
        onClose();
      }
    } catch (error) {
      console.error('Error posting service data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricLabels = {
    ai_request_total: 'AI Request Total',
    ai_request_latency_seconds: 'AI Request Latency (seconds)',
    model_inferences_total: 'Model Inferences Total',
    model_inference_errors_total: 'Model Inference Errors Total',
    model_response_time_seconds: 'Model Response Time (seconds)',
    model_batch_size: 'Model Batch Size',
    model_input_data_size_bytes: 'Input Data Size (bytes)',
    model_output_data_size_bytes: 'Output Data Size (bytes)',
    model_input_tokens_total: 'Input Tokens Total',
    model_output_tokens_total: 'Output Tokens Total',
    ai_model_accuracy: 'AI Model Accuracy',
    ai_model_loss: 'AI Model Loss',
    ai_memory_usage_bytes: 'AI Memory Usage (bytes)',
    ai_cpu_usage_percent: 'AI CPU Usage (%)',
    ai_gpu_memory_usage_bytes: 'AI GPU Memory Usage (bytes)',
    ai_gpu_utilization_percent: 'AI GPU Utilization (%)'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
      <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', p: 2 }}>
        <Box display="flex" alignItems="center">
          <AddIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Add New AI Service</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box mb={3}>
          <TextField
            label="Service Name"
            fullWidth
            variant="outlined"
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
              setNameError('');
            }}
            error={!!nameError}
            helperText={nameError}
            required
            margin="normal"
          />
        </Box>

        <Box mb={3}>
          {instances.map((instance, index) => (
            <Grid container spacing={2} key={index} alignItems="center" mb={2}>
              <Grid item xs={5}>
                <TextField
                  label={`Host #${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={instance.host}
                  onChange={(e) => handleInstanceChange(index, 'host', e.target.value)}
                  error={!!instanceErrors[index]?.host}
                  helperText={instanceErrors[index]?.host}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label={`Port #${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={instance.port}
                  onChange={(e) => handleInstanceChange(index, 'port', e.target.value)}
                  error={!!instanceErrors[index]?.port}
                  helperText={instanceErrors[index]?.port}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveInstance(index)} disabled={instances.length <= 1} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddInstance} sx={{ mt: 1 }}>
            ADD INSTANCE
          </Button>
        </Box>

        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">Metrics to Monitor</Typography>
            <Tooltip title="Select metrics you want to monitor for this AI service">
              <HelpOutlineIcon sx={{ ml: 1, color: 'text.secondary' }} />
            </Tooltip>
          </Box>

          <FormGroup>
            <Grid container spacing={2}>
              {Object.entries(metricLabels).map(([key, label]) => (
                <Grid item xs={4} key={key}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedMetrics[key]} onChange={() => handleMetricChange(key)} />}
                    label={label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button onClick={handleReset} color="primary">RESET</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={<AddIcon />}
        >
          ADD SERVICE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
