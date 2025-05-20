import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
} from "@mui/material";

import { Download as DownloadIcon } from "@mui/icons-material";

import apiFeedback from "../api/apiFeedback";

const AIServiceRatingChart = () => {
  const [allMetrics, setAllMetrics] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    apiFeedback
      .getAllFeedbackMetrics()
      .then((res) => setAllMetrics(res || {}))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter & sort
  const filteredRows = Object.entries(allMetrics || {})
    .filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = [
      "Service",
      "Used",
      "Rejected",
      "Thumbs Up",
      "Neutral",
      "Thumbs Down",
      "Total",
    ];

    const rows = filteredRows.map(([name, m]) => [
      name,
      m.usage_total,
      m.rejection_total,
      m.thumbs_up_total,
      m.neutral_total,
      m.thumbs_down_total,
      m.total_feedback,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "service_feedback_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <TextField
        label="🔍 Search service name"
        variant="outlined"
        fullWidth
        size="small"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(0);
        }}
        sx={{
          mb: 3,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && filteredRows.length === 0 && (
        <Typography>No matching services found.</Typography>
      )}

      {!loading && filteredRows.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#2c387e",
            }}
          >
            📊 All Service Feedback Metrics
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Service</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Used
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Rejected
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    👍 Thumbs Up
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    😐 Neutral
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    👎 Thumbs Down
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    🧮 Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map(([name, m]) => (
                  <TableRow
                    key={name}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f1f8ff" },
                    }}
                  >
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{m.usage_total}</TableCell>
                    <TableCell align="right">{m.rejection_total}</TableCell>
                    <TableCell align="right">{m.thumbs_up_total}</TableCell>
                    <TableCell align="right">{m.neutral_total}</TableCell>
                    <TableCell align="right">{m.thumbs_down_total}</TableCell>
                    <TableCell align="right">{m.total_feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            sx={{ mt: 1 }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AIServiceRatingChart;
