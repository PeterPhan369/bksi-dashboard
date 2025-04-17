import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AddServiceDialog = ({ open, onClose, onSave, service }) => {
  const isEditMode = !!service;
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    name: "",
    hosts: ["127.0.0.1"],
    ports: [9020],
    replicas: 1,
    metrics: {
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
      ai_memory_usage_bytes: false
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Load service data when editing
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        hosts: service.hosts || ["127.0.0.1"],
        ports: service.ports || [9020],
        replicas: service.hosts?.length || 1,
        metrics: {
          ai_request_total: service.metrics?.includes("ai_request_total") || false,
          ai_request_latency_seconds: service.metrics?.includes("ai_request_latency_seconds") || false,
          model_inferences_total: service.metrics?.includes("model_inferences_total") || false,
          model_inference_errors_total: service.metrics?.includes("model_inference_errors_total") || false,
          model_response_time_seconds: service.metrics?.includes("model_response_time_seconds") || false,
          model_batch_size: service.metrics?.includes("model_batch_size") || false,
          model_input_data_size_bytes: service.metrics?.includes("model_input_data_size_bytes") || false,
          model_output_data_size_bytes: service.metrics?.includes("model_output_data_size_bytes") || false,
          model_input_tokens_total: service.metrics?.includes("model_input_tokens_total") || false,
          model_output_tokens_total: service.metrics?.includes("model_output_tokens_total") || false,
          ai_model_accuracy: service.metrics?.includes("ai_model_accuracy") || false,
          ai_model_loss: service.metrics?.includes("ai_model_loss") || false,
          ai_memory_usage_bytes: service.metrics?.includes("ai_memory_usage_bytes") || false
        }
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [service, open]);

  // Ensure replicas always equals the number of host/port pairs
  useEffect(() => {
    if (formData.hosts.length !== formData.replicas) {
      setFormData(prev => ({
        ...prev,
        replicas: formData.hosts.length
      }));
    }
  }, [formData.hosts.length]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    
    // Validate host entries
    if (formData.hosts.length === 0) {
      newErrors.hosts = "At least one host is required";
    } else {
      formData.hosts.forEach((host, index) => {
        if (!host.trim()) {
          newErrors[`hosts[${index}]`] = "Host cannot be empty";
        }
      });
    }
    
    // Validate port entries
    if (formData.ports.length === 0) {
      newErrors.ports = "At least one port is required";
    } else {
      formData.ports.forEach((port, index) => {
        if (!port || isNaN(port)) {
          newErrors[`ports[${index}]`] = "Port must be a valid number";
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle numeric fields (but replicas will be auto-calculated)
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // We're no longer allowing direct editing of replicas since it's now synced with host/port pairs
    if (name !== 'replicas') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) || value === "") {
        setFormData({
          ...formData,
          [name]: value === "" ? "" : numValue
        });
      }
    }
  };

  // Handle checkbox changes for metrics
  const handleMetricChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      metrics: {
        ...formData.metrics,
        [name]: checked
      }
    });
  };

  // Handle hosts array changes
  const handleHostChange = (index, value) => {
    const updatedHosts = [...formData.hosts];
    updatedHosts[index] = value;
    
    setFormData({
      ...formData,
      hosts: updatedHosts
    });
  };

  // Handle ports array changes
  const handlePortChange = (index, value) => {
    const updatedPorts = [...formData.ports];
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) || value === "") {
      updatedPorts[index] = value === "" ? "" : numValue;
      
      setFormData({
        ...formData,
        ports: updatedPorts
      });
    }
  };

  // Add new host/port pair and increment replicas
  const addHostPortPair = () => {
    const newReplicas = formData.hosts.length + 1;
    setFormData({
      ...formData,
      hosts: [...formData.hosts, ""],
      ports: [...formData.ports, ""],
      replicas: newReplicas
    });
  };

  // Remove a host/port pair and decrement replicas
  const removeHostPortPair = (index) => {
    if (formData.hosts.length <= 1) {
      return; // Keep at least 1 pair
    }
    
    const updatedHosts = formData.hosts.filter((_, i) => i !== index);
    const updatedPorts = formData.ports.filter((_, i) => i !== index);
    const newReplicas = updatedHosts.length;
    
    setFormData({
      ...formData,
      hosts: updatedHosts,
      ports: updatedPorts,
      replicas: newReplicas
    });
  };

  // Post service data to API endpoint
  const postServiceData = async (serviceData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('http://127.0.0.1:8120/route/managment/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting service data:', error);
      setApiError(error.message || 'Failed to save service');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Prepare data for MongoDB based on your JSON structure
      const selectedMetrics = [];
      Object.entries(formData.metrics).forEach(([key, value]) => {
        if (value) {
          selectedMetrics.push(key);
        }
      });
      
      const dataToSave = {
        ...(isEditMode ? { _id: service._id } : {}),
        name: formData.name,
        hosts: formData.hosts,
        ports: formData.ports.map(port => parseInt(port, 10)),
        replicas: formData.hosts.length, // Ensure replicas equals the number of host/port pairs
        metrics: selectedMetrics
      };
      
      try {
        // Post to API endpoint
        await postServiceData(dataToSave);
        
        // Then notify parent component
        onSave(dataToSave);
        onClose();
      } catch (error) {
        // Error is handled in postServiceData
        // We don't close the dialog so user can correct any issues
      }
    }
  };

  const handleReset = () => {
    if (isEditMode && service) {
      const hosts = service.hosts || ["127.0.0.1"];
      setFormData({
        name: service.name || "",
        hosts: hosts,
        ports: service.ports || [9020],
        replicas: hosts.length, // Set replicas to match the number of hosts
        metrics: {
          ai_request_total: service.metrics?.includes("ai_request_total") || false,
          ai_request_latency_seconds: service.metrics?.includes("ai_request_latency_seconds") || false,
          model_inferences_total: service.metrics?.includes("model_inferences_total") || false,
          model_inference_errors_total: service.metrics?.includes("model_inference_errors_total") || false,
          model_response_time_seconds: service.metrics?.includes("model_response_time_seconds") || false,
          model_batch_size: service.metrics?.includes("model_batch_size") || false,
          model_input_data_size_bytes: service.metrics?.includes("model_input_data_size_bytes") || false,
          model_output_data_size_bytes: service.metrics?.includes("model_output_data_size_bytes") || false,
          model_input_tokens_total: service.metrics?.includes("model_input_tokens_total") || false,
          model_output_tokens_total: service.metrics?.includes("model_output_tokens_total") || false,
          ai_model_accuracy: service.metrics?.includes("ai_model_accuracy") || false,
          ai_model_loss: service.metrics?.includes("ai_model_loss") || false,
          ai_memory_usage_bytes: service.metrics?.includes("ai_memory_usage_bytes") || false
        }
      });
    } else {
      // Reset to initial form state
      setFormData(initialFormState);
    }
    setErrors({});
  };

  // Close error notification
  const handleCloseError = () => {
    setApiError(null);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {isEditMode ? <EditIcon sx={{ mr: 1 }} /> : <AddCircleIcon sx={{ mr: 1 }} />}
            <Typography variant="h6">
              {isEditMode ? `Edit Service: ${service?.name}` : "Add New AI Service"}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                required
              />
            </Grid>
            
            {/* Replicas Field - Now read-only since it's auto-calculated */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Replicas"
                name="replicas"
                type="number"
                value={formData.replicas}
                InputProps={{ 
                  readOnly: true,
                  inputProps: { min: 1 } 
                }}
                helperText="Replicas automatically matches the number of instances below"
                margin="normal"
                required
              />
            </Grid>
            
            {/* Host/Port Configuration Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                Hosts and Ports Configuration
                <Tooltip title="Enter host and port for each service instance">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {formData.hosts.map((host, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label={`Host #${index + 1}`}
                    value={host}
                    onChange={(e) => handleHostChange(index, e.target.value)}
                    error={!!errors[`hosts[${index}]`]}
                    helperText={errors[`hosts[${index}]`]}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label={`Port #${index + 1}`}
                    value={formData.ports[index]}
                    onChange={(e) => handlePortChange(index, e.target.value)}
                    error={!!errors[`ports[${index}]`]}
                    helperText={errors[`ports[${index}]`]}
                    margin="normal"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeHostPortPair(index)}
                    disabled={formData.hosts.length <= 1}
                    sx={{ mt: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                onClick={addHostPortPair}
                sx={{ mt: 1 }}
              >
                Add Instance
              </Button>
            </Grid>
            
            {/* Metrics Selection Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center' }}>
                Metrics to Monitor
                <Tooltip title="Select which metrics you want to monitor for this service">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.ai_request_total} 
                          onChange={handleMetricChange}
                          name="ai_request_total"
                        />
                      }
                      label="AI Request Total"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.ai_request_latency_seconds} 
                          onChange={handleMetricChange}
                          name="ai_request_latency_seconds"
                        />
                      }
                      label="AI Request Latency (seconds)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_inferences_total} 
                          onChange={handleMetricChange}
                          name="model_inferences_total"
                        />
                      }
                      label="Model Inferences Total"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_inference_errors_total} 
                          onChange={handleMetricChange}
                          name="model_inference_errors_total"
                        />
                      }
                      label="Model Inference Errors Total"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_response_time_seconds} 
                          onChange={handleMetricChange}
                          name="model_response_time_seconds"
                        />
                      }
                      label="Model Response Time (seconds)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_batch_size} 
                          onChange={handleMetricChange}
                          name="model_batch_size"
                        />
                      }
                      label="Model Batch Size"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_input_data_size_bytes} 
                          onChange={handleMetricChange}
                          name="model_input_data_size_bytes"
                        />
                      }
                      label="Input Data Size (bytes)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_output_data_size_bytes} 
                          onChange={handleMetricChange}
                          name="model_output_data_size_bytes"
                        />
                      }
                      label="Output Data Size (bytes)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_input_tokens_total} 
                          onChange={handleMetricChange}
                          name="model_input_tokens_total"
                        />
                      }
                      label="Input Tokens Total"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.model_output_tokens_total} 
                          onChange={handleMetricChange}
                          name="model_output_tokens_total"
                        />
                      }
                      label="Output Tokens Total"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.ai_model_accuracy} 
                          onChange={handleMetricChange}
                          name="ai_model_accuracy"
                        />
                      }
                      label="AI Model Accuracy"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.ai_model_loss} 
                          onChange={handleMetricChange}
                          name="ai_model_loss"
                        />
                      }
                      label="AI Model Loss"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.metrics.ai_memory_usage_bytes} 
                          onChange={handleMetricChange}
                          name="ai_memory_usage_bytes"
                        />
                      }
                      label="AI Memory Usage (bytes)"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleReset} color="secondary">
            Reset
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            startIcon={isEditMode ? <EditIcon /> : <AddCircleIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Saving..." 
              : isEditMode 
                ? "Update Service" 
                : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Notification */}
      <Snackbar 
        open={!!apiError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {apiError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddServiceDialog;