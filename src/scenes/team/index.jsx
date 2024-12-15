import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Function to handle add service
  const handleAddService = (id) => {
    console.log(`Add service for ID: ${id}`);
    // Add your logic here (e.g., API call or state update)
  };

  // Function to handle delete service
  const handleDeleteService = (id) => {
    console.log(`Delete service for ID: ${id}`);
    // Add your logic here (e.g., API call or state update)
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Service Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="left"
          >
            {status === "active" ? (
              <CheckCircleOutlineIcon style={{ color: colors.greenAccent[600] }} />
            ) : (
              <CancelOutlinedIcon style={{ color: colors.redAccent[600] }} />
            )}
            <Typography
              color={
                status === "active"
                  ? colors.greenAccent[600]
                  : colors.redAccent[600]
              }
              sx={{ ml: 1 }}
            >
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "services",
      headerName: "Services",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={() => handleAddService(row.id)}
              color="warning"
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteService(row.id)}
              color="secondary"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="SERVICES" subtitle="Managing the Services" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
