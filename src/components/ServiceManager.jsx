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
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PolicyIcon from "@mui/icons-material/Policy";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteIcon from "@mui/icons-material/Delete";
import MetricsDisplay from "./MetricsDisplay";
import AddServiceDialog from "./AddServiceDialog";
import apiService from "../api/apiServices";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiService.getServices();
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveService = async (serviceData) => {
    setLoading(true);
    try {
      await apiService.addService(serviceData);
      setServices(prev => [
        ...prev,
        { ...serviceData, Sname: serviceData.name, status: "active" }
      ]);
      setNotification({ open: true, message: "Service added successfully", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleDeleteService = async (serviceName) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await apiService.deleteService(serviceName);
      setServices(prev => prev.filter(s => s.Sname !== serviceName));
      setNotification({ open: true, message: "Service deleted successfully", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleCloseNotification = () =>
    setNotification(n => ({ ...n, open: false }));

  const getFrameworkColor = (framework) => ({
    tensorflow: "primary", pytorch: "secondary", keras: "success",
    onnx: "info", scikit: "warning", huggingface: "error", custom: "default"
  }[framework] || "default");

  const getTypeIcon = (type) =>
    type === "nlp" ? <PolicyIcon fontSize="small" /> : <StorageIcon fontSize="small" />;

  const getStatusColor = (status) => ({
    active: "success", inactive: "default", error: "error", maintenance: "warning"
  }[status] || "default");

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">AI Service Manager</Typography>
        <Button startIcon={<AddCircleIcon />} onClick={handleOpenDialog}>
          Add Service
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && services.length === 0 && (
        <Alert severity="info">No services found. Click "Add Service".</Alert>
      )}

      {!loading && services.length > 0 && (
        <Paper variant="outlined" sx={{ p: 0, mb: 4 }}>
          {services.map((service, idx) => (
            <React.Fragment key={service.Sname}>
              {idx > 0 && <Divider />}
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{service.Sname}</Typography>
                    <Chip
                      label={service.status}
                      size="small"
                      color={getStatusColor(service.status)}
                      sx={{ ml: 1 }}
                    />
                    <Chip
                      label={service.framework}
                      size="small"
                      color={getFrameworkColor(service.framework)}
                      sx={{ ml: 1 }}
                    />
                    <Chip
                      icon={getTypeIcon(service.type)}
                      label={service.type}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  {/* Moved delete button into details to avoid button-in-button */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                    <Tooltip title="Delete Service">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteService(service.Sname)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <MetricsDisplay metrics={service.metrics} />
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          ))}
        </Paper>
      )}

      <AddServiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveService}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceManager;
