// src/components/AddServiceDialog.jsx
import React, { useState, useEffect } from 'react';
import { addService } from '../api/apiServiceManager';
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
  const [endPoint, setEndPoint] = useState('');
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
  };

  const handleRemoveInstance = (index) => {
    if (instances.length > 1) {
      const updated = [...instances];
      updated.splice(index, 1);
      setInstances(updated);
    }
  };

  const handleInstanceChange = (index, field, value) => {
    const updated = [...instances];
    updated[index][field] = value;
    setInstances(updated);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetrics({ ...selectedMetrics, [metric]: !selectedMetrics[metric] });
  };

  const validateForm = () => {
    let valid = true;
    if (!serviceName.trim()) {
      setNameError('Service name is required');
      valid = false;
    } else setNameError('');

    const errors = instances.map(inst => {
      const err = { host: '', port: '' };
      if (!inst.host) {
        err.host = 'Host required'; valid = false;
      }
      if (!inst.port || !/^[0-9]+$/.test(inst.port) || +inst.port < 1 || +inst.port > 65535) {
        err.port = 'Port must be 1-65535'; valid = false;
      }
      return err;
    });
    setInstanceErrors(errors);
    return valid;
  };

  const handleReset = () => {
    setServiceName('');
    setEndPoint('');
    setInstances([{ host: '127.0.0.1', port: '' }]);
    setSelectedMetrics(Object.fromEntries(Object.keys(selectedMetrics).map(k => [k, false])));
    setNameError('');
    setInstanceErrors([]);
  };

  const getSelectedMetricsArray = () =>
    Object.entries(selectedMetrics)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const serviceData = {
        name: serviceName,
        endPoint,
        hosts: instances.map(i => i.host),
        ports: instances.map(i => i.port),
        replicas: instances.length,
        metrics: getSelectedMetricsArray()
      };
      const res = await addService(serviceData);
      if (res.status === 'success') {
        onServiceAdded();
        handleReset();
        onClose();
      }
    } catch (e) {
      console.error('Error posting service:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricLabels = {
    ai_request_total: 'AI Request Total',
    ai_request_latency_seconds: 'AI Request Latency (s)',
    model_inferences_total: 'Model Inferences Total',
    model_inference_errors_total: 'Model Inference Errors Total',
    model_response_time_seconds: 'Model Response Time (s)',
    model_batch_size: 'Model Batch Size',
    model_input_data_size_bytes: 'Input Data Size (B)',
    model_output_data_size_bytes: 'Output Data Size (B)',
    model_input_tokens_total: 'Input Tokens Total',
    model_output_tokens_total: 'Output Tokens Total',
    ai_model_accuracy: 'AI Model Accuracy',
    ai_model_loss: 'AI Model Loss',
    ai_memory_usage_bytes: 'AI Memory Usage (B)',
    ai_cpu_usage_percent: 'AI CPU Usage (%)',
    ai_gpu_memory_usage_bytes: 'AI GPU Memory Usage (B)',
    ai_gpu_utilization_percent: 'AI GPU Utilization (%)'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <AddIcon />
          <Typography variant="h6">Add New AI Service</Typography>
          <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Service Name"
          fullWidth
          value={serviceName}
          onChange={e => { setServiceName(e.target.value); setNameError(''); }}
          error={!!nameError}
          helperText={nameError}
          required
          margin="normal"
        />
        <TextField
          label="Service Endpoint"
          fullWidth
          value={endPoint}
          onChange={e => setEndPoint(e.target.value)}
          required
          margin="normal"
          placeholder="e.g. /api/v1/my-service"
        />

        {instances.map((instance, idx) => (
          <Grid container spacing={2} alignItems="center" key={idx}>
            <Grid item xs={5}>
              <TextField
                label={`Host #${idx+1}`}
                fullWidth
                value={instance.host}
                onChange={e => handleInstanceChange(idx, 'host', e.target.value)}
                error={!!instanceErrors[idx]?.host}
                helperText={instanceErrors[idx]?.host}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={`Port #${idx+1}`}
                fullWidth
                value={instance.port}
                onChange={e => handleInstanceChange(idx, 'port', e.target.value)}
                error={!!instanceErrors[idx]?.port}
                helperText={instanceErrors[idx]?.port}
                required
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleRemoveInstance(idx)} disabled={instances.length<=1} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddInstance} sx={{ mt: 2 }}>
          ADD INSTANCE
        </Button>

        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">Metrics to Monitor</Typography>
            <Tooltip title="Select metrics you want to monitor">
              <HelpOutlineIcon sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
          <FormGroup>
            <Grid container spacing={2}>
              {Object.entries(metricLabels).map(([key, label]) => (
                <Grid item xs={4} key={key}>
                  <FormControlLabel
                    control={
                    <Checkbox 
                      checked={selectedMetrics[key]} 
                      onChange={() => handleMetricChange(key)}
                      />
                    }
                    label={label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>RESET</Button>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
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