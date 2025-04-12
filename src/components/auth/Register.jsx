// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
// Import icons if you don't have them already
import GoogleIcon from '../../assets/google-icon.png'; // Add these icons to your assets folder
import AppleIcon from '../../assets/apple-icon.png';   // Add these icons to your assets folder

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  const { register } = useAuth();
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
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setRegisterError('');
    
    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      // After successful registration, redirect to login page
      navigate('/login', { 
        state: { message: 'Registration successful! Please login with your new credentials.' }
      });
    } catch (error) {
      setRegisterError(error.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    // Implement Google register logic
    console.log('Google register clicked');
  };

  const handleAppleRegister = () => {
    // Implement Apple register logic
    console.log('Apple register clicked');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Create an Account</h2>
        
        <div className="social-login-buttons">
          <button 
            className="social-button google-button" 
            onClick={handleGoogleRegister}
          >
            <img src={GoogleIcon} alt="Google" className="social-icon" />
            <span>Google</span>
          </button>
          
          <button 
            className="social-button apple-button" 
            onClick={handleAppleRegister}
          >
            <img src={AppleIcon} alt="Apple" className="social-icon" />
            <span>Apple</span>
          </button>
        </div>

        <div className="divider">
          <span className="divider-text">or</span>
        </div>
        
        {registerError && (
          <div className="error-message">
            {registerError}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <i className="user-icon">👤</i>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                disabled={submitting}
              />
            </div>
            {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
          </div>
          
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
          
          <div className="form-group">
            <div className="input-with-icon">
              <i className="password-icon">🔒</i>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                disabled={submitting}
              />
            </div>
            {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="signup-prompt">
          Already have an account? <Link to="/login" className="signup-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;