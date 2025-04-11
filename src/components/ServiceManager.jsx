import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Snackbar
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch services from the API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await apiService.getServices();
      setServices(fetchedServices);
      setError(null);
    } catch (err) {
      setError("Failed to load services. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenDialog = (service = null) => {
    setEditingService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
  };

  const handleSaveService = async (serviceData) => {
    try {
      let savedService;
      
      if (editingService) {
        // Update existing service
        savedService = await apiService.updateService(editingService._id, serviceData);
        setServices(services.map(s => 
          s._id === savedService._id ? savedService : s
        ));
        setNotification({
          open: true,
          message: "Service updated successfully",
          severity: "success"
        });
      } else {
        // Create new service
        savedService = await apiService.createService(serviceData);
        setServices([...services, savedService]);
        setNotification({
          open: true,
          message: "Service added successfully",
          severity: "success"
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: `Error: ${err.response?.data?.error || "Failed to save service"}`,
        severity: "error"
      });
    }
  };

  const handleDeleteService = async (id, event) => {
    // Stop event propagation to prevent accordion from toggling
    event.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await apiService.deleteService(id);
        setServices(services.filter(service => service._id !== id));
        setNotification({
          open: true,
          message: "Service deleted successfully",
          severity: "success"
        });
      } catch (err) {
        setNotification({
          open: true,
          message: "Failed to delete service",
          severity: "error"
        });
      }
    }
  };

  const handleEditService = (service, event) => {
    // Stop event propagation to prevent accordion from toggling
    event.stopPropagation();
    handleOpenDialog(service);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const getFrameworkColor = (framework) => {
    const colors = {
      tensorflow: "primary",
      pytorch: "secondary",
      keras: "success",
      onnx: "info",
      scikit: "warning",
      huggingface: "error",
      custom: "default"
    };
    return colors[framework] || "default";
  };
  
  const getTypeIcon = (type) => {
    if (type === "nlp") return <PolicyIcon fontSize="small" />;
    return <StorageIcon fontSize="small" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      inactive: "default",
      error: "error",
      maintenance: "warning"
    };
    return colors[status] || "default";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" component="h1">
          AI Service Manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Add Service
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : services.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No services found. Click "Add Service" to create one.
        </Alert>
      ) : (
        <Paper elevation={0} variant="outlined" sx={{ p: 0, mb: 4 }}>
          {services.map((service, index) => (
            <React.Fragment key={service._id}>
              {index > 0 && <Divider />}
              <Accordion disableGutters elevation={0}>
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    px: 2
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {service.Sname} <Typography component="span" variant="caption" color="text.secondary">v{service.version}</Typography>
                    </Typography>
                    
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={`Status: ${service.status}`}>
                        <Chip 
                          label={service.status} 
                          size="small" 
                          color={getStatusColor(service.status)}
                          sx={{ mr: 1 }}
                        />
                      </Tooltip>
                      
                      <Tooltip title={`Framework: ${service.framework}`}>
                        <Chip 
                          label={service.framework} 
                          size="small" 
                          color={getFrameworkColor(service.framework)}
                          sx={{ mr: 1 }}
                        />
                      </Tooltip>
                      
                      <Tooltip title={`Type: ${service.type}`}>
                        <Chip 
                          icon={getTypeIcon(service.type)}
                          label={service.type} 
                          size="small"
                          variant="outlined"
                          sx={{ mr: 2 }}
                        />
                      </Tooltip>
                      
                      <Tooltip title="Edit Service">
                        <Button
                          size="small"
                          color="primary"
                          sx={{ minWidth: 'unset', mr: 1 }}
                          onClick={(e) => handleEditService(service, e)}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip title="Delete Service">
                        <Button
                          size="small"
                          color="error"
                          sx={{ minWidth: 'unset' }}
                          onClick={(e) => handleDeleteService(service._id, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                  {service.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                  )}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(service.createdAt).toLocaleString()} • 
                      Last Updated: {new Date(service.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <MetricsDisplay metrics={service.metrics} />
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          ))}
        </Paper>
      )}

      {/* Add/Edit Service Dialog */}
      <AddServiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveService}
        service={editingService}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceManager;