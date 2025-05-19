// src/api/apiServiceManager.jsx
import axios from "axios";

axios.defaults.withCredentials = true;

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
      `/api/route/manage/service`,
      transformedData,
      {
        headers: { "Content-Type": "application/json" , "bksi-api-key": "876a9d27b102efe34f9e2523fd622933f0d4ac258a714fc370032bfd12aeb8bc"},
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
    const { data } = await axios.delete(`/api/service/${serviceName}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error deleting service:", error.response?.data || error.message);
    throw new Error("Failed to delete service. Please try again later.");
  }
};

export const addInstance = async (instanceData) => {
  const payload = {
    id: instanceData.serviceId,
    host: instanceData.host,
    port: instanceData.port,
    endPoint: instanceData.endPoint,
  };

  try {
    console.log("📤 Sending new instance:", payload);
    const { data } = await axios.post(
      `/api/instance`,
      payload,
      { withCredentials: true }
    );
    console.log("✅ Received from /instance:", data);
    return data;
  } catch (error) {
    console.error("❌ Error adding instance:", error.response?.data || error.message);
    throw new Error("Failed to add instance. Please try again later.");
  }
};

export const deleteInstance = async (instanceId) => {
  try {
    const { data } = await axios.delete(`/api/instance/${instanceId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error deleting instance:", error.response?.data || error.message);
    throw new Error("Failed to delete instance. Please try again later.");
  }
};

export default {
  addService,
  deleteService,
  addInstance,
  deleteInstance,
};