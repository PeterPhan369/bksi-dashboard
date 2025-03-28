import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import SpeedIcon from "@mui/icons-material/Speed";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SettingsIcon from "@mui/icons-material/Settings";

const metricIcons = {
  cpu: <SpeedIcon sx={{ color: "#FFA500", mr: 1 }} />, // Orange for CPU
  mem: <MemoryIcon sx={{ color: "#00BFFF", mr: 1 }} />, // Blue for Memory
  latency: <SettingsIcon sx={{ color: "#FFD700", mr: 1 }} />, // Yellow for Latency
  accuracy: <CheckCircleIcon sx={{ color: "#32CD32", mr: 1 }} />, // Green for Accuracy
  availability: <CloudDoneIcon sx={{ color: "#008080", mr: 1 }} />, // Teal for Availability
  throughput: <CompareArrowsIcon sx={{ color: "#9932CC", mr: 1 }} />, // Purple for Throughput
  errorRate: <ErrorOutlineIcon sx={{ color: "#FF0000", mr: 1 }} />, // Red for Errors
  driftDetection: <TrackChangesIcon sx={{ color: "#FF69B4", mr: 1 }} />, // Pink for Drift Detection
};

const MetricsDisplay = ({ metrics }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(metrics).map(([key, value]) => (
        <Grid item xs={6} sm={4} md={3} key={key}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1E1E1E", color: "#FFF" }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              {metricIcons[key] || null}
              <Typography variant="subtitle2" sx={{ color: "#00BFFF" }}>
                {key.toUpperCase()}
              </Typography>
            </Box>
            <Typography variant="h6">{value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsDisplay;
