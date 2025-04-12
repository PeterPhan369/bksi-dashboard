// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, register, logout, getCurrentUser, isAuthenticated } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};