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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from 'uuid';
import { mockDataTeam } from "../data/mockData";

const ServiceManager = ({ initialServices = mockDataTeam, onServicesChange, themeColors }) => {
  const [services, setServices] = useState(initialServices);
  const [openModal, setOpenModal] = useState(false);
  const [openInstanceModal, setOpenInstanceModal] = useState(false);
  const [formData, setFormData] = useState({ Sname: "", id: "", host: "", port: "" });
  const [currentServiceId, setCurrentServiceId] = useState(null);

  const handleOpenModal = () => {
    setFormData({ Sname: "" });
    setOpenModal(true);
  };

  const handleOpenInstanceModal = (serviceId) => {
    setFormData({ id: "", host: "", port: "" });
    setCurrentServiceId(serviceId);
    setOpenInstanceModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ Sname: "" });
  };

  const handleCloseInstanceModal = () => {
    setOpenInstanceModal(false);
    setFormData({ id: "", host: "", port: "" });
    setCurrentServiceId(null);
  };

  const handleSaveService = () => {
    if (formData.Sname.trim()) {
      const newService = {
        id: uuidv4(),
        Sname: formData.Sname,
        ServiceInstances: [],
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      mockDataTeam.push(newService);
      if (onServicesChange) onServicesChange(updatedServices);
    }
    handleCloseModal();
  };

  const handleSaveInstance = () => {
    if (currentServiceId && formData.id.trim() && formData.host.trim() && formData.port.trim()) {
      const newInstance = {
        id: formData.id,
        host: formData.host,
        port: formData.port,
        status: true,
      };
      const updatedServices = services.map(service => 
        service.id === currentServiceId
          ? { ...service, ServiceInstances: [...service.ServiceInstances, newInstance] }
          : service
      );
      setServices(updatedServices);
      const serviceIndex = mockDataTeam.findIndex(service => service.id === currentServiceId);
      if (serviceIndex !== -1) {
        mockDataTeam[serviceIndex].ServiceInstances.push(newInstance);
      }
      if (onServicesChange) onServicesChange(updatedServices);
    }
    handleCloseInstanceModal();
  };

  const handleDelete = (id) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    const index = mockDataTeam.findIndex(service => service.id === id);
    if (index !== -1) mockDataTeam.splice(index, 1);
    if (onServicesChange) onServicesChange(updatedServices);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
                  <IconButton onClick={() => handleOpenInstanceModal(service.id)}>
                    <AddCircleIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {service.ServiceInstances.map((instance) => (
                <Box key={instance.id} p={1}>
                  <Typography variant="body1">ID: {instance.id}</Typography>
                  <Typography variant="body1">Host: {instance.host}</Typography>
                  <Typography variant="body1">Port: {instance.port}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {/* Modal for Adding Service */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          p={4}
          m="auto"
          mt="10%"
          width="30%"
          bgcolor={themeColors.grey[800]}
          borderRadius="8px"
        >
          <Typography variant="h6" mb={2}>Add Service</Typography>
          <TextField
            fullWidth
            label="Service Name"
            name="Sname"
            value={formData.Sname}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveService}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal for Adding Instance */}
      <Modal open={openInstanceModal} onClose={handleCloseInstanceModal}>
        <Box
          p={4}
          m="auto"
          mt="10%"
          width="30%"
          bgcolor={themeColors.grey[800]}
          borderRadius="8px"
        >
          <Typography variant="h6" mb={2}>Add Instance</Typography>
          <TextField
            fullWidth
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Host"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Port"
            name="port"
            value={formData.port}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveInstance}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServiceManager;
