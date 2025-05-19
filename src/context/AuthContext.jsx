// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  // On mount, check if we already have a user vv
  useEffect(() => {
    const stored = authApi.getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user } = await authApi.login(credentials);
      setUser(user);
      setNotification({ show: true, message: 'Login successful!', type: 'success' });
      return true;
    } catch (err) {
      setNotification({ show: true, message: err.message || 'Login failed.', type: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    setLoading(true);
    try {
      await authApi.register(userData);
      setNotification({ show: true, message: 'Registration successful!', type: 'success' });
      return true;
    } catch (err) {
      setNotification({ show: true, message: err.message || 'Registration failed.', type: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    authApi.logout();
    setUser(null);
    setNotification({ show: true, message: 'Logged out.', type: 'info' });
  };

  const clearNotification = () => {
    setNotification({ show: false, message: '', type: 'info' });
  };

  // Auth is purely: do we have a user?
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || null,
        login,
        logout,
        register,
        isAuthenticated,
        loading,
        notification,
        clearNotification,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
