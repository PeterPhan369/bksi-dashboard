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

// Short metric names
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

// Fake data
const FAKE_SERVICES = [
  {
    _id: "1", Sname: "GPT-4", version: "1.2.0", framework: "tensorflow", type: "nlp", status: "active",
    description: "Text classification service", createdAt: "2024-10-15T08:30:00.000Z",
    updatedAt: "2025-04-20T11:45:00.000Z",
    metrics: {
      requestsPerDay: 12500, averageLatency: 78, errorRate: 0.5, uptime: 99.95,
      ai_request_total: 10000, ai_request_latency_seconds: 0.2, model_inferences_total: 9500, ai_model_accuracy: 97.5
    },
    selectedMetrics: DEFAULT_METRICS
  },
  {
    _id: "2", Sname: "GPT-3.5", version: "2.1.5", framework: "pytorch", type: "vision", status: "active",
    description: "Image recognition service", createdAt: "2024-08-22T15:20:00.000Z",
    updatedAt: "2025-05-02T09:10:00.000Z",
    metrics: {
      requestsPerDay: 8700, averageLatency: 120, errorRate: 1.2, uptime: 99.8,
      ai_request_total: 9000, ai_request_latency_seconds: 0.25, model_inferences_total: 8700, ai_model_accuracy: 95.1
    },
    selectedMetrics: DEFAULT_METRICS
  }
];

// Mock API
const mockApiService = {
  getServices: () => Promise.resolve(FAKE_SERVICES),
  createService: (data) => {
    const newService = {
      _id: Math.random().toString(36).substr(2, 9),
      Sname: data.name, version: data.version || "1.0.0",
      framework: data.framework || "custom",
      type: data.type || "nlp",
      status: data.status || "active",
      description: data.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {},
      selectedMetrics: data.selectedMetrics || DEFAULT_METRICS
    };
    return Promise.resolve(newService);
  },
  updateService: (id, data) => {
    const updated = {
      ...data, _id: id, updatedAt: new Date().toISOString()
    };
    return Promise.resolve(updated);
  },
  deleteService: (id) => Promise.resolve({ success: true })
};

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
