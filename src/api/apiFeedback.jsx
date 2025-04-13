// src/api/apiFeedback.js
import axios from 'axios';

// Option 1: Use absolute URL (adjust the port if needed)
const API_BASE_URL = 'http://localhost:5000';

// Option 2: If you prefer a proxy (see below), then you can use a relative URL:
// const API_BASE_URL = '';

export const fetchRatings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/ratings`);
    return response.data; // Expected to be an array of service objects
  } catch (error) {
    console.error('Error fetching service ratings:', error);
    throw error;
  }
};

export const fetchUsages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/usages`);
      return response.data; // expected array of service documents
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }
  };
