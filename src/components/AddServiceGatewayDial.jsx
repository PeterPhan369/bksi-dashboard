// 📁 components/AddServiceGatewayDial.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Grid, Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createNewServiceAPI } from '../api/apiGateway';

const AddServiceGatewayDial = ({ open, onClose, onServiceAdded }) => {
  const [serviceName, setServiceName] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [instances, setInstances] = useState([{ host: '', port: '' }]);
  const [nameError, setNameError] = useState('');
  const [instanceErrors, setInstanceErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInstanceErrors(instances.map(() => ({ host: '', port: '' })));
  }, [instances.length]);

  const handleAddInstance = () => {
    setInstances([...instances, { host: '', port: '' }]);
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

  const validateForm = () => {
    let valid = true;

    if (!serviceName.trim()) {
      setNameError('Service name is required');
      valid = false;
    } else {
      setNameError('');
    }

    const errors = instances.map(inst => {
      const err = { host: '', port: '' };
      if (!inst.host) {
        err.host = 'Host required';
        valid = false;
      }
      if (!inst.port || !/^\d+$/.test(inst.port) || +inst.port < 1 || +inst.port > 65535) {
        err.port = 'Port must be 1–65535';
        valid = false;
      }
      return err;
    });
    setInstanceErrors(errors);

    return valid;
  };

  const handleReset = () => {
    setServiceName('');
    setEndPoint('');
    setInstances([{ host: '', port: '' }]);
    setNameError('');
    setInstanceErrors([]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: serviceName,
        endPoint,
        instances: instances.map((inst) => ({ host: inst.host, port: inst.port })),
      };

      const res = await createNewServiceAPI(payload);
      if (res?.message === 'sucess') {
        await onServiceAdded();
        handleReset();
        onClose();
      }
    } catch (err) {
      console.error('Error creating service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <AddIcon />
          <Typography variant="h6" ml={1}>Add API Gateway Service</Typography>
          <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Service Name"
          fullWidth
          value={serviceName}
          onChange={(e) => { setServiceName(e.target.value); setNameError(''); }}
          error={!!nameError}
          helperText={nameError}
          required
          margin="normal"
        />
        <TextField
          label="Service Endpoint"
          fullWidth
          value={endPoint}
          onChange={(e) => setEndPoint(e.target.value)}
          required
          margin="normal"
          placeholder="/api/your-endpoint"
        />

        {instances.map((instance, idx) => (
          <Grid container spacing={2} alignItems="center" key={idx} mt={1}>
            <Grid item xs={5}>
              <TextField
                label={`Host #${idx + 1}`}
                fullWidth
                value={instance.host}
                onChange={(e) => handleInstanceChange(idx, 'host', e.target.value)}
                error={!!instanceErrors[idx]?.host}
                helperText={instanceErrors[idx]?.host}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={`Port #${idx + 1}`}
                fullWidth
                value={instance.port}
                onChange={(e) => handleInstanceChange(idx, 'port', e.target.value)}
                error={!!instanceErrors[idx]?.port}
                helperText={instanceErrors[idx]?.port}
                required
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                onClick={() => handleRemoveInstance(idx)}
                disabled={instances.length <= 1}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddInstance} sx={{ mt: 2 }}>
          Add Instance
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button onClick={handleReset}>Reset</Button>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<AddIcon />}
            type="button"
            disabled={isSubmitting}
          >
            Add Service
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceGatewayDial;