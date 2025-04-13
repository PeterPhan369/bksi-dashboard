// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Clear any potentially corrupted auth data on initial load
const token = localStorage.getItem('authToken');
const user = localStorage.getItem('user');

// If auth data is incomplete, clear it
if ((!token && user) || (token && !user)) {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);