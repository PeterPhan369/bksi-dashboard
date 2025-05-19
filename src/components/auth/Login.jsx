import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import '../auth/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  // Only grab login, isAuthenticated, and loading:
  const { login, isAuthenticated, loading } = useAuth();

  // Redirect once isAuthenticated flips to true
  useEffect(() => {
    console.log('[useEffect] isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Redirecting after login');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (formErrors[name]) setFormErrors(f => ({ ...f, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const success = await login(formData);
    if (success) {
      console.log('Navigating to dashboard...');
      // No manual navigate here—useEffect will handle it
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Box className="auth-box">
          <Typography component="h1" variant="h4" className="auth-title">
            Sign In
          </Typography>
          <form onSubmit={handleSubmit} className="auth-form">
            <TextField
              margin="normal" required fullWidth
              id="username" label="Username" name="username"
              autoComplete="username" autoFocus
              value={formData.username} onChange={handleChange}
              error={!!formErrors.username} helperText={formErrors.username}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Person/></InputAdornment>)
              }}
              variant="outlined"
            />
            <TextField
              margin="normal" required fullWidth
              name="password" label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password" autoComplete="current-password"
              value={formData.password} onChange={handleChange}
              error={!!formErrors.password} helperText={formErrors.password}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock/></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <Button
              type="submit" fullWidth variant="contained" color="primary"
              className="auth-submit" disabled={loading}
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </Button>
            <Box className="auth-links">
              <Link to="/register" className="auth-link">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
