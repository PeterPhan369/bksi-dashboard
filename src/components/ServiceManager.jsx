import React, { useState, useEffect } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Button, Chip, Paper, Divider, Tooltip, CircularProgress,
  Alert, Snackbar
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PolicyIcon from "@mui/icons-material/Policy";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notif, setNotif] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    mockApiService.getServices()
      .then(setServices)
      .catch(() => setError("Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  const openDialogFor = svc => { setEditing(svc); setOpen(true); };
  const closeDialog = () => { setEditing(null); setOpen(false); };

  const handleSave = async data => {
    try {
      let saved;
      if (editing) {
        saved = await mockApiService.updateService(editing._id, data);
        setServices(s => s.map(x => x._id === saved._id ? saved : x));
        setNotif({ open: true, message: "Service updated", severity: "success" });
      } else {
        saved = await mockApiService.createService(data);
        setServices(s => [...s, saved]);
        setNotif({ open: true, message: "Service added", severity: "success" });
      }
    } catch {
      setNotif({ open: true, message: "Error saving service", severity: "error" });
    } finally {
      closeDialog();
    }
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this service?")) return;
    mockApiService.deleteService(id).then(() => {
      setServices(s => s.filter(x => x._id !== id));
      setNotif({ open: true, message: "Service deleted", severity: "info" });
    });
  };

  const getFrameworkColor = fw => ({ tensorflow: "primary", pytorch: "secondary", keras: "success" }[fw] || "default");
  const getTypeIcon = t => (t === "nlp" ? <PolicyIcon /> : <StorageIcon />);
  const getStatusColor = st => ({ active: "success", error: "error", maintenance: "warning" }[st] || "default");

  if (loading) return <Box sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">AI Service Manager</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => openDialogFor(null)}>
          Add Service
        </Button>
      </Box>

      <Paper variant="outlined">
        {services.length === 0 &&
          <Alert severity="info">No services yet. Click “Add Service” to start.</Alert>}
        {services.map((svc, i) => (
          <React.Fragment key={svc._id}>
            {i > 0 && <Divider />}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {svc.Sname} <Typography component="span" variant="caption" color="text.secondary">v{svc.version}</Typography>
                  </Typography>
                  <Chip label={svc.status} size="small" color={getStatusColor(svc.status)} sx={{ mr: 1 }} />
                  <Chip label={svc.framework} size="small" color={getFrameworkColor(svc.framework)} sx={{ mr: 1 }} />
                  <Chip icon={getTypeIcon(svc.type)} label={svc.type} size="small" variant="outlined" sx={{ mr: 2 }} />
                  <Tooltip title="Edit"><Button onClick={e => { e.stopPropagation(); openDialogFor(svc); }}><EditIcon /></Button></Tooltip>
                  <Tooltip title="Delete"><Button color="error" onClick={e => { e.stopPropagation(); handleDelete(svc._id); }}><DeleteIcon /></Button></Tooltip>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{svc.description}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  Created: {new Date(svc.createdAt).toLocaleString()} • Updated: {new Date(svc.updatedAt).toLocaleString()}
                </Typography>
                <MetricsDisplay metrics={svc.metrics} selected={svc.selectedMetrics} labels={METRIC_LABELS} />
              </AccordionDetails>
            </Accordion>
          </React.Fragment>
        ))}
      </Paper>

      <AddServiceDialog
        open={openDialog}
        onClose={closeDialog}
        onSave={handleSave}
        service={editing}
        allMetrics={Object.keys(METRIC_LABELS)}
        defaultMetrics={DEFAULT_METRICS}
        metricLabels={METRIC_LABELS}
      />

      <Snackbar open={notif.open} autoHideDuration={4000} onClose={() => setNotif(n => ({ ...n, open: false }))}>
        <Alert severity={notif.severity} variant="filled">{notif.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceManager;
