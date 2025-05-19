import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material"; // ✅ Add Dialog, DialogTitle, etc.
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const APIKeyTable = ({ userId, refreshTrigger }) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ New state for confirmation dialog
  const [open, setOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState(null);

  const fetchKeys = async () => {
    try {
      const res = await axios.get(`/api/keys/${userId}`);
      setKeys(res.data.data); // adapt if response structure differs
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (keyId) => {
    setSelectedKeyId(keyId);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/key/${selectedKeyId}`);
      setKeys((prev) => prev.filter((k) => k.id !== selectedKeyId));
    } catch (err) {
      console.error("Failed to delete API key:", err);
    } finally {
      setOpen(false);
      setSelectedKeyId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpen(false);
    setSelectedKeyId(null);
  };

  useEffect(() => {
    fetchKeys();
  }, [userId, refreshTrigger]);

  if (loading) return <CircularProgress />;

  if (!keys) {
    return <Typography>Can not fetch API keys found for this user.</Typography>;
  }

  console.log(keys);

  if (!keys.length) {
    return <Typography>No API keys found for this user.</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.value}</TableCell>
                <TableCell>
                  {new Date(key.createdAt).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(key.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Confirmation Dialog */}
      <Dialog open={open} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this API key? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default APIKeyTable;
