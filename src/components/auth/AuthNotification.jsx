import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Alert, Snackbar } from '@mui/material';

const AuthNotification = () => {
  const { notification, clearNotification } = useAuth();
  const { show, message, type } = notification;

  if (!show) return null;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification();
  };

  return (
    <Snackbar
      open={show}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={type} 
        sx={{ width: '100%' }}
        elevation={6}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AuthNotification;