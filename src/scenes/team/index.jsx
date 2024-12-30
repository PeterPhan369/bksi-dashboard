import React from "react";
import { Box } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ServiceManager from "../../components/ServiceManager";
import { mockDataTeam } from "../../data/mockData";
import { useTheme } from "@mui/material";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleServicesChange = (updatedServices) => {
    console.log("Updated services:", updatedServices);
  };

  return (
    <Box m="20px">
      <Header title="SERVICES" subtitle="Manage Services and Instances" />
      <ServiceManager
        initialServices={mockDataTeam}
        onServicesChange={handleServicesChange}
        themeColors={colors}
      />
    </Box>
  );
};

export default Team;
