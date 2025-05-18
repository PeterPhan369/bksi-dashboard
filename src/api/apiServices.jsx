import axios from "axios";

const API_URL = "/api";

// Mock data fallback for getServices
const mockServices = [
  {
    Sname: "MockService",
    framework: "Flask",
    type: "REST",
    status: "active",
    metrics: [],
    instances: [
      {
        id: 1,
        host: "localhost",
        port: 8000,
        endPoint: "/mock",
        status: "running",
      },
    ],
  },
];

export async function getServices() {
  try {
    // Try to get from backend (currently will 404 if backend doesn't implement GET /service)
    const response = await axios.get(`${API_URL}/service`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services, falling back to mock:", error.message);

    // Return mock data fallback on any error (like 404)
    return mockServices;
  }
}

export const addService = async (serviceData) => {
  try {
    console.log("Sending serviceData:", serviceData);

    const response = await axios.post(`${API_URL}/service`, serviceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw new Error("Failed to add service. Please try again later.");
  }
};

export const deleteService = async (serviceName) => {
  try {
    const response = await axios.delete(`${API_URL}/service/${serviceName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service. Please try again later.");
  }
};

export const deleteInstance = async (instanceId) => {
  try {
    const response = await axios.delete(`${API_URL}/instance/${instanceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting instance:", error);
    throw new Error("Failed to delete instance. Please try again later.");
  }
};

export const addInstance = async (instanceData) => {
  try {
    const response = await axios.post(`${API_URL}/instance`, instanceData);
    return response.data;
  } catch (error) {
    console.error("Error adding instance:", error);
    throw new Error("Failed to add instance. Please try again later.");
  }
};

const apiServices = {
  getServices,
  addService,
  deleteService,
  deleteInstance,
  addInstance,
};

export default apiServices;
