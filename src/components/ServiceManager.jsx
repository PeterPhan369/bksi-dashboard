// Fixed ServiceRow with delete and add instance modals + delete service modal in parent
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddServiceDialog from "./AddServiceDialog";
import apiService from "../api/apiServices";
import ServiceRow from "./ServiceRow";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDeleteService, setConfirmDeleteService] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await apiService.getServices();
      setServices(data);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveService = async () => {
    try {
      setLoading(true);
      setNotification({
        open: true,
        message: "Service added",
        severity: "success",
      });
      handleCloseDialog();
    } catch (err) {
      console.error("Add Service Error:", err);
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      const data = await apiService.getServices();
      setServices(data);
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!confirmDeleteService) return;
    try {
      await apiService.deleteService(confirmDeleteService);
      setServices((prev) =>
        prev.filter((s) => s.name !== confirmDeleteService)
      );
      setNotification({
        open: true,
        message: "Service deleted",
        severity: "success",
      });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setConfirmDeleteService(null);
    }
  };

  const handleDeleteInstance = async (serviceName, instanceId) => {
    try {
      await apiService.deleteInstance(instanceId);
      setServices((prev) =>
        prev.map((s) =>
          s.name === serviceName
            ? {
                ...s,
                instances: s.instances.filter((i) => i.id !== instanceId),
              }
            : s
        )
      );
      setNotification({
        open: true,
        message: "Instance deleted",
        severity: "success",
      });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleAddInstance = async (serviceId, host, port, endPoint) => {
    try {
      await apiService.addInstance({ serviceId, host, port, endPoint });
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                instances: [
                  ...(s.instances || []),
                  { id: crypto.randomUUID(), host, port, endPoint },
                ],
              }
            : s
        )
      );
      setNotification({
        open: true,
        message: "Instance added",
        severity: "success",
      });
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
    setNotification((n) => ({ ...n, open: false }));
  const handleOpenDeleteConfirm = (serviceName) =>
    setConfirmDeleteService(serviceName);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3, fontSize: "1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontSize: "1.6rem", fontWeight: "bold" }}
        >
          AI Service Manager
        </Typography>
        <Button
          startIcon={<AddCircleIcon />}
          onClick={handleOpenDialog}
          sx={{ fontSize: "1rem" }}
        >
          Add Service
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && services.length === 0 && (
        <Alert severity="info" sx={{ fontSize: "1rem" }}>
          No services found. Click "Add Service".
        </Alert>
      )}

      {!loading && services.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Service Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service, index) =>
                service?.name ? (
                  <ServiceRow
                    key={service.name || index} // fallback key
                    service={service}
                    onDeleteService={handleOpenDeleteConfirm}
                    onDeleteInstance={handleDeleteInstance}
                    onAddInstance={handleAddInstance}
                  />
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddServiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onServiceAdded={handleSaveService}
      />

      <Dialog
        open={!!confirmDeleteService}
        onClose={() => setConfirmDeleteService(null)}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Confirm Delete Service
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Are you sure you want to delete this service?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={() => setConfirmDeleteService(null)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteService}
            color="error"
            variant="contained"
            sx={{
              minWidth: 100,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ fontSize: "0.95rem" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceManager;
