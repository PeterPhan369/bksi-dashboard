import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const MetricsDisplay = ({ metrics }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(metrics).map(([key, value]) => (
        <Grid item xs={6} sm={4} md={3} key={key}>
          <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1E1E1E", color: "#FFF" }}>
            <Typography variant="subtitle2" sx={{ color: "#00BFFF" }}>
              {key.toUpperCase()}
            </Typography>
            <Typography variant="h6">{value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsDisplay;
