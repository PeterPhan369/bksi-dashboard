// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to load services. Please try again later.');
  }
};

export const addService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error adding service:', error);
    throw new Error('Failed to add service. Please try again later.');
  }
};

export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Failed to delete service. Please try again later.');
  }
};

export const deleteInstance = async (serviceId, instanceId) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}/instances/${instanceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting instance:', error);
    throw new Error('Failed to delete instance. Please try again later.');
  }
};

export const updateInstanceStatus = async (serviceId, instanceId, status) => {
  try {
    const response = await axios.put(`${API_URL}/services/${serviceId}/instances/${instanceId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating instance:', error);
    throw new Error('Failed to update instance. Please try again later.');
  }
};

export const addInstance = async (serviceId) => {
  try {
    const response = await axios.post(`${API_URL}/services/${serviceId}/instances`);
    return response.data;
  } catch (error) {
    console.error('Error adding instance:', error);
    throw new Error('Failed to add instance. Please try again later.');
  }
};

const apiServices = {
  getServices,
  addService,
  deleteService,
  deleteInstance,
  updateInstanceStatus,
  addInstance
};

export default apiServices;