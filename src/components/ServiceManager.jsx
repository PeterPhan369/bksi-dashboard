import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Modal,
  TextField,
  Grid2,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ServiceManager = ({ initialServices, onServicesChange, themeColors }) => {
  const [services, setServices] = useState(initialServices);
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleOpenModal = (data = null) => {
    setEditingData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  const handleSave = (newData) => {
    if (editingData) {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === newData.id ? { ...service, ...newData } : service
        )
      );
    } else {
      setServices((prevServices) => [...prevServices, newData]);
    }
    onServicesChange(services);
    handleCloseModal();
  };

  const handleDelete = (id, type = "service", parentId = null) => {
    if (type === "service") {
      setServices((prevServices) => prevServices.filter((service) => service.id !== id));
    } else if (type === "entity" && parentId) {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === parentId
            ? {
                ...service,
                ServiceInstances: service.ServiceInstances.filter((instance) => instance.id !== id),
              }
            : service
        )
      );
    }
    onServicesChange(services);
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
      >
        Add Service
      </Button>
      <Box>
        {services.map((service) => (
          <Accordion key={service.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: themeColors.blueAccent[700],
                color: themeColors.grey[100],
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="h6">{service.Sname}</Typography>
                <Box>
                  <IconButton onClick={() => handleOpenModal(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service.id, "service")}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: themeColors.primary[400] }}>
              {service.ServiceInstances.map((instance) => (
                <Box
                  key={instance.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="10px"
                  mb="10px"
                  borderRadius="5px"
                  backgroundColor={themeColors.grey[900]}
                >
                  <Box>
                    <Typography variant="body1">
                      <strong>ID:</strong> {instance.id}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Host:</strong> {instance.host}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Port:</strong> {instance.port}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenModal(instance)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(instance.id, "entity", service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          p={4}
          m="auto"
          mt="10%"
          width="50%"
          bgcolor={themeColors.grey[800]}
          borderRadius="8px"
        >
          <Typography variant="h6" mb={2}>
            {editingData ? "Edit Service/Entity" : "Add Service"}
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Service/Entity Name"
                defaultValue={editingData?.Sname || editingData?.id || ""}
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField fullWidth label="Host" defaultValue={editingData?.host || ""} />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField fullWidth label="Port" defaultValue={editingData?.port || ""} />
            </Grid2>
            <Grid2 item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(editingData || {})}
              >
                Save
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServiceManager;
