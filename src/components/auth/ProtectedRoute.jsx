// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Use the context

const ProtectedRoute = () => {
  // Get authentication status and loading state from context
  const { isAuthenticated, isLoading } = useAuth();

  // Optional: Show loading state while context is initializing/validating token
  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // Redirect if not authenticated according to the context state
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;