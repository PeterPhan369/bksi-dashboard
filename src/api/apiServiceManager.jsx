import axios from 'axios';

// Get API key from environment variable
const API_KEY = "851ccf9d6395aca1ea2c8ad7acafcb154ab6de15ebf3011af842fa703862c001";

// Configure axios with base URL and reasonable defaults
const api = axios.create({
  headers: {
    "bksi-api-key": API_KEY,
    "Content-Type": "application/json"
  },
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
});

// Helper to validate response is valid JSON, not HTML
const validateResponse = (response) => {
  const contentType = response.headers?.['content-type'] || '';
  if (contentType.includes('text/html')) {
    throw new Error('Received HTML response instead of JSON. Check server configuration.');
  }
  return response;
};

export const getServices = async () => {
  try {
    const response = await api.get("http://127.0.0.1:8210/route/manage/services");
    validateResponse(response);
    console.log("Fetched services:", response.data);
    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout fetching services");
      throw new Error("Connection timeout. Server may be unavailable.");
    } else if (error.response) {
      // Server responded with non-2xx status
      const status = error.response.status;
      console.error(`Error ${status} fetching services:`, error.response.data);
      
      if (status === 401 || status === 403) {
        throw new Error("Authentication error. Please check your API key.");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received when fetching services");
      throw new Error("No response from server. Please check your network connection.");
    }
    
    // Generic or custom error
    console.error("Error fetching services:", error.message);
    
    // If we got HTML back, likely a proxy or CORS issue
    if (error.message?.includes('HTML response')) {
      console.error("Received HTML instead of JSON. Check proxy configuration.");
      // Return empty array to prevent mapping errors
      return [];
    }
    
    throw new Error("Failed to fetch services. Please try again later.");
  }
};

export const addService = async (serviceData) => {
  const transformedData = {
    name: serviceData.name,
    endPoint: serviceData.endPoint,
    hosts: serviceData.hosts,
    ports: serviceData.ports,
    replicas: serviceData.replicas,
    metrics: serviceData.metrics || [],
  };

  try {
    console.log("📤 Sending transformed data:", JSON.stringify(transformedData, null, 2));
    const { data } = await axios.post(
      /api/route/manage/service,
      transformedData,
      {
        headers: { "Content-Type": "application/json" , "bksi-api-key": "eec96a20fe978aa32da406b8957b5ee73d17d1a2964fbb7b99f76f3495b05f85"},
      }
    );
    console.log("✅ Received response from /service:", data);
    return data;
  } catch (error) {
    const errData = error.response?.data;
    console.error("❌ Error posting service:", errData || error.message);
    throw new Error("Failed to add service. Please try again later.");
  }
};

export const deleteService = async (serviceName) => {
  try {
    const { data } = await axios.delete("/api/service/${serviceName}", {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error deleting service:", error.response?.data || error.message);
    throw new Error("Failed to delete service. Please try again later.");
  }
};
// Export all methods as a default object for cleaner imports
export default {
  getServices,
  addService,
  deleteService
};