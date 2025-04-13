// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
// Import icons if you don't have them already
import GoogleIcon from '../../assets/google-icon.png'; // Add these icons to your assets folder
import AppleIcon from '../../assets/apple-icon.png';   // Add these icons to your assets folder

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setLoginError('');
    
    try {
      // This line is key - we need to properly get and store the response
      const response = await login(formData);
      
      // Make sure we're storing the token and user data from the response
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard'); // Navigate to dashboard after successful login
      } else {
        throw new Error('Invalid login response - no token received');
      }
    } catch (error) {
      setLoginError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    // Implement Apple login logic
    console.log('Apple login clicked');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Log in with</h2>
        
        <div className="social-login-buttons">
          <button 
            className="social-button google-button" 
            onClick={handleGoogleLogin}
          >
            <img src={GoogleIcon} alt="Google" className="social-icon" />
            <span>Google</span>
          </button>
          
          <button 
            className="social-button apple-button" 
            onClick={handleAppleLogin}
          >
            <img src={AppleIcon} alt="Apple" className="social-icon" />
            <span>Apple</span>
          </button>
        </div>

        <div className="divider">
          <span className="divider-text">or</span>
        </div>
        
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <i className="email-icon">✉️</i>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                disabled={submitting}
              />
            </div>
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <i className="password-icon">🔒</i>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={submitting}
              />
            </div>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="signup-prompt">
          Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;