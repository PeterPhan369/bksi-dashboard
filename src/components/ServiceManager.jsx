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
import apiService from "../api/apiServiceManager";

const METRIC_LABELS = {
  ai_request_total: "Req Total",
  ai_request_latency_seconds: "Latency (s)",
  model_inferences_total: "Inferences",
  model_inference_errors_total: "Errors",
  model_response_time_seconds: "Resp Time",
  model_batch_size: "Batch",
  model_input_data_size_bytes: "In Size",
  model_output_data_size_bytes: "Out Size",
  model_input_tokens_total: "In Tokens",
  model_output_tokens_total: "Out Tokens",
  ai_model_accuracy: "Accuracy",
  ai_model_loss: "Loss",
  ai_memory_usage_bytes: "Memory"
};

const DEFAULT_METRICS = [
  "ai_request_total",
  "ai_request_latency_seconds",
  "model_inferences_total",
  "ai_model_accuracy"
];

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
    const fetchServicesData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getServices();
        setServices(data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setNotification({
          open: true,
          message: `Failed to load services: ${error.message || "Unknown error"}`,
          severity: "error",
        });
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveService = async (serviceDataFromDialog) => {
    setLoading(true);
    try {
      const newService = await apiService.addService(serviceDataFromDialog);
      setServices(prev => [...prev, newService]);
      setNotification({ open: true, message: "Service added successfully", severity: "success" });
    } catch (err) {
      console.error("Failed to add service:", err);
      setNotification({
        open: true,
        message: `Failed to add service: ${err.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleDeleteService = async (serviceIdentifier) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    try {
      await apiService.deleteService(serviceIdentifier);
      setServices(prev => prev.filter(s => s.Sname !== serviceIdentifier));
      setNotification({ open: true, message: "Service deleted successfully", severity: "success" });
    } catch (err) {
      console.error("Failed to delete service:", err);
      setNotification({
        open: true,
        message: `Failed to delete service: ${err.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () =>
    setNotification(n => ({ ...n, open: false }));

  const getFrameworkColor = (framework) => ({
    tensorflow: "primary", pytorch: "secondary", keras: "success",
    onnx: "info", scikit: "warning", huggingface: "error", custom: "default"
  }[framework?.toLowerCase()] || "default");

  const getTypeIcon = (type) =>
    type?.toLowerCase() === "nlp" ? <PolicyIcon fontSize="small" /> : <StorageIcon fontSize="small" />;

  const getStatusColor = (status) => ({
    active: "success", inactive: "default", error: "error", maintenance: "warning"
  }[status?.toLowerCase()] || "default");

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">AI Service Manager</Typography>
        <Button startIcon={<AddCircleIcon />} onClick={handleOpenDialog} variant="contained">
          Add Service
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && services.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>No services found. Click "Add Service" to get started.</Alert>
      )}

      {!loading && services.length > 0 && (
        <Paper variant="outlined" sx={{ p: 0, mb: 4 }}>
          {services.map((service, idx) => (
            <React.Fragment key={service._id || service.Sname}>
              {idx > 0 && <Divider />}
              <Accordion disableGutters defaultExpanded={idx === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{service.Sname || "Unnamed Service"}</Typography>
                    {service.status && (
                      <Chip
                        label={service.status}
                        size="small"
                        color={getStatusColor(service.status)}
                      />
                    )}
                    {service.framework && (
                       <Chip
                        label={service.framework}
                        size="small"
                        color={getFrameworkColor(service.framework)}
                      />
                    )}
                    {service.type && (
                      <Chip
                        icon={getTypeIcon(service.type)}
                        label={service.type}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
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
                  <MetricsDisplay metrics={service.metrics || {}} metricLabels={METRIC_LABELS} />
                  {service.description && <Typography variant="body2" color="textSecondary" sx={{mt:1}}>{service.description}</Typography>}
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
        defaultMetrics={DEFAULT_METRICS}
      />

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
