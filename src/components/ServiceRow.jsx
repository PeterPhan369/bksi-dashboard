// Fixed ServiceRow with delete and add instance modals
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon
} from "@mui/icons-material";

const ServiceRow = ({ service, onDeleteService, onDeleteInstance, onAddInstance }) => {
  const [open, setOpen] = useState(false);
  const [showAddInstance, setShowAddInstance] = useState(false);
  const [newInstance, setNewInstance] = useState({ host: "", port: "", endPoint: "" });
  const [confirmDeleteInstance, setConfirmDeleteInstance] = useState(null);

  const handleAddInstanceSubmit = () => {
    onAddInstance(service.id, newInstance.host, newInstance.port, newInstance.endPoint);
    setShowAddInstance(false);
    setNewInstance({ host: "", port: "", endPoint: "" });
  };

  return (
    <>
      <TableRow sx={{ "& td": { py: 1.5, px: 2, fontSize: "1rem" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{service.name}</TableCell>
        <TableCell align="right">
          <IconButton
            onClick={() => onDeleteService(service.name)}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 2, mt: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Instances
                </Typography>
                <Button size="small" onClick={() => setShowAddInstance(true)} startIcon={<AddCircleIcon />}>
                  Add Instance
                </Button>
              </Box>
              <Table size="medium">
                <TableHead sx={{ backgroundColor: "#fafafa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>Host</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>Port</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>Endpoint</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: "1rem" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(service.instances || []).map((inst) => (
                    <TableRow key={inst.id} sx={{ "& td": { py: 1, px: 2, fontSize: "0.95rem" } }}>
                      <TableCell>{inst.host}</TableCell>
                      <TableCell>{inst.port}</TableCell>
                      <TableCell>{inst.endPoint}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setConfirmDeleteInstance(inst.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog open={showAddInstance} onClose={() => setShowAddInstance(false)}>
        <DialogTitle>Add Instance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Host"
            value={newInstance.host}
            onChange={(e) => setNewInstance((prev) => ({ ...prev, host: e.target.value }))}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Port"
            value={newInstance.port}
            onChange={(e) => setNewInstance((prev) => ({ ...prev, port: e.target.value }))}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Endpoint"
            value={newInstance.endPoint}
            onChange={(e) => setNewInstance((prev) => ({ ...prev, endPoint: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button onClick={() => setShowAddInstance(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAddInstanceSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteInstance} onClose={() => setConfirmDeleteInstance(null)}>
        <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete Instance</DialogTitle>
        <DialogContent>
          <Typography align="center">Are you sure you want to delete this instance?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button onClick={() => setConfirmDeleteInstance(null)} variant="outlined" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDeleteInstance(service.name, confirmDeleteInstance);
              setConfirmDeleteInstance(null);
            }}
            color="error"
            variant="contained"
            sx={{ minWidth: 100, boxShadow: "none", '&:hover': { boxShadow: 'none' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceRow;