import axios from "axios";

// Axios instance with credentials (for JWT cookie)
const gatewayAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // Ensures JWT cookies are sent
});

// ─── CREATE NEW API GATEWAY SERVICE ───────────────────────────────
export const createNewServiceAPI = async (payload) => {
  try {
    const { data } = await gatewayAxios.post("/service", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Failed to create API Gateway service:", error.response?.data || error.message);
    throw new Error("Failed to create API Gateway service.");
  }
};

// ─── GET ALL SERVICES ─────────────────────────────────────────────
export const getAllGatewayServices = async () => {
  try {
    const { data } = await gatewayAxios.get("/service");
    return data.data || []; // ✅ extract nested data array
  } catch (error) {
    console.error("❌ Failed to fetch API Gateway services:", error.message);
    return [];
  }
};

// ─── DELETE SERVICE ───────────────────────────────────────────────
export const deleteGatewayService = async (serviceName) => {
  try {
    const { data } = await gatewayAxios.delete(`/service/${serviceName}`);
    return data;
  } catch (error) {
    console.error("❌ Failed to delete API Gateway service:", error.message);
    throw new Error("Failed to delete API Gateway service.");
  }
};

// ─── ADD INSTANCE ─────────────────────────────────────────────────
export const addGatewayInstance = async (instanceData) => {
  try {
    const { data } = await gatewayAxios.post("/instance", instanceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Failed to add instance:", error.message);
    throw new Error("Failed to add instance.");
  }
};

// ─── DELETE INSTANCE ──────────────────────────────────────────────
export const deleteGatewayInstance = async (instanceId) => {
  try {
    const { data } = await gatewayAxios.delete(`/instance/${instanceId}`);
    return data;
  } catch (error) {
    console.error("❌ Failed to delete instance:", error.message);
    throw new Error("Failed to delete instance.");
  }
};

// ─── DEFAULT EXPORT ───────────────────────────────────────────────
export default {
  createNewServiceAPI,
  getAllGatewayServices,
  deleteGatewayService,
  addGatewayInstance,
  deleteGatewayInstance,
};
