import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Paper,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PolicyIcon from "@mui/icons-material/Policy";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MetricsDisplay from "./MetricsDisplay";
import AddServiceDialog from "./AddServiceDialog";
import apiService from "../api/apiServices";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveService = async (serviceData) => {
    setLoading(true);
    try {
      await apiService.addService(serviceData);
      setServices(prev => [...prev, { ...serviceData, Sname: serviceData.name, status: "active" }]);
      setNotification({ open: true, message: "Service added successfully", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleDeleteService = async (serviceName, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await apiService.deleteService(serviceName);
      setServices(prev => prev.filter(s => s.Sname !== serviceName));
      setNotification({ open: true, message: "Service deleted successfully", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const getFrameworkColor = (framework) => {
    const colors = {
      tensorflow: "primary", pytorch: "secondary", keras: "success",
      onnx: "info", scikit: "warning", huggingface: "error", custom: "default"
    };
    return colors[framework] || "default";
  };

  const getTypeIcon = (type) => type === "nlp" ? <PolicyIcon fontSize="small" /> : <StorageIcon fontSize="small" />;

  const getStatusColor = (status) => {
    const colors = {
      active: "success", inactive: "default", error: "error", maintenance: "warning"
    };
    return colors[status] || "default";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">AI Service Manager</Typography>
        <Button variant="contained" color="primary" startIcon={<AddCircleIcon />} onClick={handleOpenDialog}>
          Add Service
        </Button>
      </Box>

      {loading && <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>}

      {!loading && services.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No services found. Click "Add Service" to create one.
        </Alert>
      )}

      {!loading && services.length > 0 && (
        <Paper elevation={0} variant="outlined" sx={{ p: 0, mb: 4 }}>
          {services.map((service, index) => (
            <React.Fragment key={service.Sname}>
              {index > 0 && <Divider />}
              <Accordion disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {service.Sname}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={`Status: ${service.status}`}>
                        <Chip label={service.status} size="small" color={getStatusColor(service.status)} sx={{ mr: 1 }} />
                      </Tooltip>
                      <Tooltip title={`Framework: ${service.framework}`}>
                        <Chip label={service.framework} size="small" color={getFrameworkColor(service.framework)} sx={{ mr: 1 }} />
                      </Tooltip>
                      <Tooltip title={`Type: ${service.type}`}>
                        <Chip icon={getTypeIcon(service.type)} label={service.type} size="small" variant="outlined" sx={{ mr: 2 }} />
                      </Tooltip>
                      <Tooltip title="Delete Service">
                        <Button size="small" color="error" onClick={(e) => handleDeleteService(service.Sname, e)}>
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <MetricsDisplay metrics={service.metrics} />
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          ))}
        </Paper>
      )}

      <AddServiceDialog open={openDialog} onClose={handleCloseDialog} onSave={handleSaveService} />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceManager;
