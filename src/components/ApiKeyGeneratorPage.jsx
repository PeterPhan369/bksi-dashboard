// src/components/ApiKeyGeneratorPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  CircularProgress
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// --- Import the API service function ---
import { generateApiKey } from '../api/apiKey'; // Adjust path as needed

const ApiKeyGeneratorPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // --- Updated handler using the service ---
  const handleGenerateKey = async () => {
    setLoading(true);
    setApiKey('');

    try {
      // Call the separated API service function
      const fetchedKey = await generateApiKey();

      // Update state on success
      setApiKey(fetchedKey);
      setNotification({
        open: true,
        message: 'New API Key generated successfully!',
        severity: 'success',
      });

    } catch (error) {
      // Handle errors thrown by the service function
      console.error('Failed to fetch API Key:', error);
      setNotification({
        open: true,
        // Use the error message provided by the service function
        message: error.message || 'Failed to generate API Key.',
        severity: 'error',
      });
      setApiKey(''); // Ensure key is cleared on error

    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  // --- Copy key function remains the same ---
  const handleCopyKey = async () => {
    if (!apiKey) {
      setNotification({ open: true, message: 'Generate an API Key first!', severity: 'warning' });
      return;
    }
    try {
      await navigator.clipboard.writeText(apiKey);
      setNotification({ open: true, message: 'API Key copied to clipboard!', severity: 'success' });
    } catch (err) {
      console.error('Failed to copy API Key:', err);
      setNotification({ open: true, message: 'Failed to copy API Key.', severity: 'error' });
    }
  };

  // --- Close notification function remains the same ---
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // --- JSX Rendering part remains the same ---
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Key Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Generate a unique API key from the server to authenticate your requests.
        </Typography>

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VpnKeyIcon />}
          onClick={handleGenerateKey}
          disabled={loading}
          size="large"
          sx={{ mb: 3 }}
        >
          {loading ? 'Generating...' : 'Generate New API Key'}
        </Button>

        {apiKey && !loading && (
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'grey.100' }}>
            <TextField
              fullWidth
              readOnly
              value={apiKey}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000',
                  backgroundColor: 'white',
                  cursor: 'text'
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '0.95rem'
                }
              }}
            />
            <Tooltip title="Copy API Key">
              <IconButton onClick={handleCopyKey} color="primary">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        )}

        {loading && !apiKey && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ApiKeyGeneratorPage;