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
  FormHelperText
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AddServiceDialog = ({ open, onClose, onSave, service }) => {
  const isEditMode = !!service;
  
  const initialFormState = {
    Sname: "",
    type: "classification",
    framework: "tensorflow",
    version: "1.0",
    description: "",
    status: "inactive",
    metrics: {
      cpu: "0%",
      mem: "0 MB",
      latency: "0ms",
      accuracy: "0%",
      availability: "100%",
      throughput: "0 req/s",
      errorRate: "0%",
      driftDetection: "0",
    },
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Load service data when editing
  useEffect(() => {
    if (service) {
      setFormData({
        Sname: service.Sname || "",
        type: service.type || "classification",
        framework: service.framework || "tensorflow",
        version: service.version || "1.0",
        description: service.description || "",
        status: service.status || "inactive",
        metrics: {
          cpu: service.metrics?.cpu || "0%",
          mem: service.metrics?.mem || "0 MB",
          latency: service.metrics?.latency || "0ms",
          accuracy: service.metrics?.accuracy || "0%",
          availability: service.metrics?.availability || "100%",
          throughput: service.metrics?.throughput || "0 req/s",
          errorRate: service.metrics?.errorRate || "0%",
          driftDetection: service.metrics?.driftDetection || "0",
        },
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [service, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Sname.trim()) newErrors.Sname = "Service name is required";
    if (!formData.version.trim()) newErrors.version = "Version is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // If editing, preserve the ID
      const dataToSave = isEditMode ? { _id: service._id, ...formData } : formData;
      onSave(dataToSave);
      onClose();
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      // Reset to original service data
      setFormData({
        Sname: service.Sname || "",
        type: service.type || "classification",
        framework: service.framework || "tensorflow",
        version: service.version || "1.0",
        description: service.description || "",
        status: service.status || "inactive",
        metrics: {
          cpu: service.metrics?.cpu || "0%",
          mem: service.metrics?.mem || "0 MB",
          latency: service.metrics?.latency || "0ms",
          accuracy: service.metrics?.accuracy || "0%",
          availability: service.metrics?.availability || "100%",
          throughput: service.metrics?.throughput || "0 req/s",
          errorRate: service.metrics?.errorRate || "0%",
          driftDetection: service.metrics?.driftDetection || "0",
        },
      });
    } else {
      // Reset to initial form state
      setFormData(initialFormState);
    }
    setErrors({});
  };

  const aiModelTypes = [
    { value: "classification", label: "Classification" },
    { value: "detection", label: "Object Detection" },
    { value: "segmentation", label: "Segmentation" },
    { value: "nlp", label: "Natural Language Processing" },
    { value: "generation", label: "Generative AI" },
    { value: "recommendation", label: "Recommendation System" },
    { value: "custom", label: "Custom Model" },
  ];

  const frameworks = [
    { value: "tensorflow", label: "TensorFlow" },
    { value: "pytorch", label: "PyTorch" },
    { value: "keras", label: "Keras" },
    { value: "onnx", label: "ONNX" },
    { value: "scikit", label: "Scikit-Learn" },
    { value: "huggingface", label: "Hugging Face" },
    { value: "custom", label: "Custom Framework" },
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "error", label: "Error" },
    { value: "maintenance", label: "Maintenance" },
  ];

  return (
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
            {isEditMode ? `Edit Service: ${service.Sname}` : "Add New AI Service"}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Service Name"
              name="Sname"
              value={formData.Sname}
              onChange={handleChange}
              error={!!errors.Sname}
              helperText={errors.Sname}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              error={!!errors.version}
              helperText={errors.version}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Model Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Model Type"
                onChange={handleChange}
              >
                {aiModelTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Framework</InputLabel>
              <Select
                name="framework"
                value={formData.framework}
                label="Framework"
                onChange={handleChange}
              >
                {frameworks.map((framework) => (
                  <MenuItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
              Metrics
              <Tooltip title="These values represent the current operational metrics for the service.">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="CPU Usage"
              name="metrics.cpu"
              value={formData.metrics.cpu}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Memory Usage"
              name="metrics.mem"
              value={formData.metrics.mem}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Latency"
              name="metrics.latency"
              value={formData.metrics.latency}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Accuracy"
              name="metrics.accuracy"
              value={formData.metrics.accuracy}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Availability"
              name="metrics.availability"
              value={formData.metrics.availability}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Throughput"
              name="metrics.throughput"
              value={formData.metrics.throughput}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Error Rate"
              name="metrics.errorRate"
              value={formData.metrics.errorRate}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Drift Detection"
              name="metrics.driftDetection"
              value={formData.metrics.driftDetection}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
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
        >
          {isEditMode ? "Update Service" : "Add Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;