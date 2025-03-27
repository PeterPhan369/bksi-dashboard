import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import MetricsDisplay from "./MetricsDisplay"; // Import component

// Predefined Example Data
const initialServices = [
  {
    id: uuidv4(),
    Sname: "AI Model A",
    metrics: {
      cpu: "15%",
      mem: "1.2 GB",
      latency: "0.5ms",
      accuracy: "98%",
      availability: "99.9%",
      throughput: "250 req/s",
      errorRate: "1.5%",
      driftDetection: "0.02",
    },
  },
  {
    id: uuidv4(),
    Sname: "AI Model B",
    metrics: {
      cpu: "30%",
      mem: "800 MB",
      latency: "0.3ms",
      accuracy: "95%",
      availability: "99.8%",
      throughput: "300 req/s",
      errorRate: "0.5%",
      driftDetection: "0.01",
    },
  },
  {
    id: uuidv4(),
    Sname: "AI Model A",
    metrics: {
      cpu: "15%",
      mem: "1.2 GB",
      latency: "0.5ms",
      accuracy: "98%",
      availability: "99.9%",
      throughput: "250 req/s",
      errorRate: "1.5%",
      driftDetection: "0.02",
    },
  },
];

const ServiceManager = () => {
  const [services, setServices] = useState(initialServices); // Use initial data
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ Sname: "" });

  const handleOpenModal = () => {
    setFormData({ Sname: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveService = () => {
    if (formData.Sname.trim()) {
      const newService = {
        id: uuidv4(),
        Sname: formData.Sname,
        metrics: {
          cpu: "0%",
          mem: "0 MB",
          latency: "0ms",
          accuracy: "0%",
          availability: "100%",
          throughput: "0 req/s",
          errorRate: "0%",
          driftDetection: "None",
        },
      };
      setServices([...services, newService]);
    }
    handleCloseModal();
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={handleOpenModal}
        sx={{ mb: 2 }}
      >
        Add Service
      </Button>
      <Box>
        {services.map((service) => (
          <Accordion key={service.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{service.Sname}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MetricsDisplay metrics={service.metrics} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Add Service Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Service
          </Typography>
          <TextField
            fullWidth
            label="Service Name"
            value={formData.Sname}
            onChange={(e) => setFormData({ Sname: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSaveService}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServiceManager;
