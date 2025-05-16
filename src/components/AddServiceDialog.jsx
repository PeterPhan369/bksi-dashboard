// src/components/AddServiceDialog.jsx
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
  Grid,
  Tooltip,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AddServiceDialog = ({ open, onClose, onSave, service }) => {
  const isEditMode = !!service;
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

  useEffect(() => {
    if (service) {
      // load editing data
      setFormData({
        name: service.name || "",
        hosts: service.hosts || ["127.0.0.1"],
        ports: service.ports || [9020],
        replicas: service.replicas || (service.hosts?.length || 1),
        metrics: service.metrics || {}
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [service, open]);

  useEffect(() => {
    if (formData.hosts.length !== formData.replicas) {
      setFormData(prev => ({ ...prev, replicas: formData.hosts.length }));
    }
  }, [formData.hosts.length]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        metrics: { ...formData.metrics, [name]: checked }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleHostChange = (index, value) => {
    const hosts = [...formData.hosts]; hosts[index] = value;
    setFormData({ ...formData, hosts });
  };

  const handlePortChange = (index, value) => {
    const ports = [...formData.ports]; ports[index] = value;
    setFormData({ ...formData, ports });
  };

  const addHostPortPair = () => {
    setFormData({
      ...formData,
      hosts: [...formData.hosts, ""],
      ports: [...formData.ports, ""]
    });
  };

  const removeHostPortPair = index => {
    if (formData.hosts.length <= 1) return;
    const hosts = formData.hosts.filter((_, i) => i !== index);
    const ports = formData.ports.filter((_, i) => i !== index);
    setFormData({ ...formData, hosts, ports });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const selectedMetrics = Object.entries(formData.metrics)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    const newService = {
      _id: service?._id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      hosts: formData.hosts,
      ports: formData.ports.map(p => parseInt(p, 10)),
      replicas: formData.hosts.length,
      metrics: selectedMetrics,
      createdAt: service?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: service?.description || ''
    };
    onSave(newService);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditMode ? <EditIcon /> : <AddCircleIcon />} {' '}
          {isEditMode ? `Edit Service: ${service?.name}` : "Add New AI Service"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Service Name" name="name"
                value={formData.name} onChange={handleChange}
                error={!!errors.name} helperText={errors.name} required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Replicas"
                value={formData.replicas} InputProps={{ readOnly: true }}
                helperText="Matches host/port count" />
            </Grid>

            {/* Host/Port pairs */}
            {formData.hosts.map((h, i) => (
              <React.Fragment key={i}>
                <Grid item xs={5} md={5}>
                  <TextField
                    fullWidth label={`Host #${i+1}`} value={h}
                    onChange={e => handleHostChange(i, e.target.value)}
                  />
                </Grid>
                <Grid item xs={5} md={5}>
                  <TextField
                    fullWidth label={`Port #${i+1}`} value={formData.ports[i]}
                    onChange={e => handlePortChange(i, e.target.value)}
                    type="number" />
                </Grid>
                <Grid item xs={2} md={2}>&nbsp;
                  <IconButton color="error" onClick={() => removeHostPortPair(i)} disabled={formData.hosts.length<=1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addHostPortPair}>
                Add Instance
              </Button>
            </Grid>

            {/* Metrics */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Metrics to Monitor</Typography>
              <Divider sx={{ mb:2 }} />
              <FormGroup row>
                {Object.keys(initialFormState.metrics).map(key => (
                  <FormControlLabel key={key}
                    control={<Checkbox name={key} checked={formData.metrics[key]||false} onChange={handleChange} />}
                    label={key} />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color={isEditMode?'secondary':'primary'}>
            {isEditMode?'Update Service':'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AddServiceDialog;