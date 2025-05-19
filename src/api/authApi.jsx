// src/api/authApi.jsx
import axios from 'axios';

// Automatically send & receive cookies
axios.defaults.withCredentials = true;

export const login = async (credentials) => {
  try {
    // Ensure username and password exist
    if (!credentials?.username || !credentials?.password) {
      throw new Error("Username and password are required.");
    }

    // Backend sets HTTP-only cookies on this call
    await axios.post(`http://127.0.0.1:8210/login`, {
      username: credentials.username,
      password: credentials.password,
    });

    // Store minimal user info so we know someone is logged in
    const user = { username: credentials.username };
    localStorage.setItem('user', JSON.stringify(user));

    // Fetch API key (cookies auto‑sent)
    try {
      const { data } = await axios.get(`http://127.0.0.1:8210/key`);
      if (data.apiKey) {
        localStorage.setItem('apiKey', data.apiKey);
      }
    } catch (err) {
      console.warn('Could not fetch API key:', err?.response?.status);
    }

    return { user };
  } catch (error) {
    console.error('Login error:', error);
    // Make sure to throw a consistent object even if response is missing
    throw {
      message: error?.response?.data?.message || error?.message || 'Login failed.',
    };
  }
};

export const register = async (userData) => {
  const { data } = await axios.post(`http://127.0.0.1:8210/signup`, userData);
  
  return data;
};

export const logout = async () => {
  // Clear client‑side markers
  const { data } = await axios.post(`http://127.0.0.1:8210/logout`,);
  console.log("logout");
};

export const getCurrentUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

export const isAuthenticated = () => !!getCurrentUser();

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
};
