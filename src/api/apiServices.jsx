import axios from "axios";

const apiKey = import.meta.env.VITE_BKSI_API_KEY;

axios.defaults.withCredentials = true;

// ─── GET ALL SERVICES ─────────────────────────────────────────────
export const getServices = async () => {
  try {
    const { data } = await axios.get(`/api/route/manage/services`, {
      headers: {
        "Content-Type": "application/json",
        "bksi-api-key": apiKey,
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching services:", error.message);
    return [];
  }
};

// ─── ADD SERVICE ──────────────────────────────────────────────────
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
    console.log("📤 Sending transformed data:", transformedData);
    const { data } = await axios.post(
      `/api/route/manage/service`,
      transformedData,
      {
        headers: {
          "Content-Type": "application/json",
          "bksi-api-key": apiKey,
        },
      }
    );
    console.log("✅ Added service:", data);
    return data;
  } catch (error) {
    const errData = error.response?.data;
    console.error("❌ Error adding service:", errData || error.message);
    throw new Error("Failed to add service. Please try again later.");
  }
};

// ─── DELETE SERVICE ───────────────────────────────────────────────
export const deleteService = async (serviceName) => {
  try {
    const { data } = await axios.delete(`/api/route/manage/service/${serviceName}`, {
      headers: { "bksi-api-key": apiKey },
    });
    return data;
  } catch (error) {
    console.error(
      "❌ Error deleting service:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete service. Please try again later.");
  }
};

export const addInstance = async ({ serviceId, host, port, endPoint }) => {
  const payload = {
    id: serviceId,
    host,
    port,
    endPoint,
  };

  try {
    console.log("📤 Sending new instance:", payload);
    const { data } = await axios.post(`/api/route/manage/instance`, payload, {
      headers: { "Content-Type": "application/json", "bksi-api-key": apiKey },
    });
    console.log("✅ Received from /instance:", data);
    return data;
  } catch (error) {
    console.error(
      "❌ Error adding instance:",
      error.response?.data || error.message
    );
    throw new Error("Failed to add instance. Please try again later.");
  }
};

// ─── DELETE INSTANCE ──────────────────────────────────────────────
export const deleteInstance = async (instanceId) => {
  try {
    const { data } = await axios.delete(`/api/route/manage/instance/${instanceId}`, {
      headers: { "bksi-api-key": apiKey },
    });
    return data;
  } catch (error) {
    console.error(
      "Error deleting instance:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete instance. Please try again later.");
  }
};

// ─── DEFAULT EXPORT ───────────────────────────────────────────────
export default {
  getServices,
  addService,
  deleteService,
  addInstance,
  deleteInstance,
};
