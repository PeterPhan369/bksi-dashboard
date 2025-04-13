// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, getCurrentUser, isAuthenticated } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check for authentication on load
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    
    setLoading(false);
  }, []);
  
  const loginUser = async (credentials) => {
    setError(null);
    try {
      const data = await login(credentials);
      setCurrentUser(data.user);
      return data; // Make sure we're returning the data!
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    }
  };
  
  const registerUser = async (userData) => {
    setError(null);
    try {
      const data = await register(userData);
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };
  
  const logoutUser = () => {
    logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    isAuthenticated: () => !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;