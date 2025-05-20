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
import AddServiceGatewayDial from "../../components/AddServiceGatewayDial";
import apiGateway from "../../api/apiGateway";
import APIServiceRow from "../../components/ApiServiceRow";

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [confirmDeleteService, setConfirmDeleteService] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const rawData = await apiGateway.getAllGatewayServices();
      const formattedData = rawData.map(service => ({
        id: service.id,
        name: service.Sname,
        endPoint: service.endPoint,
        instances: service.ServiceInstances
      }));
      setServices(formattedData);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleAddInstance = async (id, host, port) => {
    try {
      await apiGateway.addGatewayInstance({ id, host, port });
      loadServices();
      setNotification({ open: true, message: "Instance added", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleDeleteInstance = async (serviceName, instanceId) => {
    try {
      await apiGateway.deleteGatewayInstance(instanceId);
      loadServices();
      setNotification({ open: true, message: "Instance deleted", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleDeleteService = async () => {
    if (!confirmDeleteService) return;
    try {
      await apiGateway.deleteGatewayService(confirmDeleteService);
      setNotification({ open: true, message: "Service deleted", severity: "success" });
      loadServices();
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setConfirmDeleteService(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">API Gateway Services</Typography>
        <Button startIcon={<AddCircleIcon />} onClick={() => setOpenDialog(true)}>
          Add Service
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Alert severity="info">No services found. Click "Add Service" to begin.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell />
                <TableCell><strong>Service Name</strong></TableCell>
                <TableCell><strong>Endpoint</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map(service => (
                <APIServiceRow
                  key={service.id}
                  service={service}
                  onDeleteService={setConfirmDeleteService}
                  onDeleteInstance={handleDeleteInstance}
                  onAddInstance={handleAddInstance}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddServiceGatewayDial
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onServiceAdded={loadServices}
      />

      <Dialog open={!!confirmDeleteService} onClose={() => setConfirmDeleteService(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this service?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteService(null)}>Cancel</Button>
          <Button onClick={handleDeleteService} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(n => ({ ...n, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
