// src/components/auth/AuthNotification.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Auth.css';

const AuthNotification = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    // Check if location.state contains a message
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      setType(location.state.type || 'success');
      setVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!visible) return null;

  return (
    <div className={`notification ${type === 'error' ? 'error-message' : 'success-message'}`}>
      {message}
      <button 
        className="close-btn" 
        onClick={() => setVisible(false)}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default AuthNotification;