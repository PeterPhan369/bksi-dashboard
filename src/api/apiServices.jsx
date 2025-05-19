// src/api/apiServices.jsx
import axios from "axios";

const API_BASE = "http://127.0.0.1:8210"; // Corrected to match docker-compose exposed port

axios.defaults.withCredentials = true;

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
    const { data } = await axios.get(`http://127.0.0.1:8210/service`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching services, falling back to mock:", error.message);
    return mockServices;
  }
}

export default {
  getServices,
};
