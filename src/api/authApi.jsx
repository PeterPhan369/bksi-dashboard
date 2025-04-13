// src/api/authApi.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Keep consistent with your existing API

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data; // Make sure we're returning the data!
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Failed to login. Please try again later.' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || { message: 'Failed to register. Please try again later.' };
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};

const authApi = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authApi;