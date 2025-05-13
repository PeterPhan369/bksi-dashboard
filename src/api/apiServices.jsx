import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`); // 🚫 this endpoint doesn't exist
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to load services. Please try again later.');
  }
};

export const addService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/service`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error adding service:', error);
    throw new Error('Failed to add service. Please try again later.');
  }
};

export const deleteService = async (serviceName) => {
  try {
    const response = await axios.delete(`${API_URL}/service/${serviceName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Failed to delete service. Please try again later.');
  }
};

export const deleteInstance = async (instanceId) => {
  try {
    const response = await axios.delete(`${API_URL}/instance/${instanceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting instance:', error);
    throw new Error('Failed to delete instance. Please try again later.');
  }
};

export const addInstance = async (instanceData) => {
  try {
    const response = await axios.post(`${API_URL}/instance`, instanceData);
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
  addInstance
};

export default apiServices;
