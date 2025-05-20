// src/api/apiFeedback.js
import axios from 'axios';

const apiKey = import.meta.env.VITE_BKSI_API_KEY;

export const fetchSuggestions = async (serviceName, limit) => {
  const params = {};
  if (limit !== undefined) params.limit = limit;
  const resp = await axios.get(`${API_BASE_URL}/suggestions/${serviceName}`, { params });
  return resp.data.map(item => ({ text: item.value, timestamp: item.timestamp }));
};

const fetchRawServiceMetrics = async (serviceName) => {
  const resp = await axios.get(`${API_BASE_URL}/metrics/${serviceName}`);
  return resp.data;
};

export const fetchAllServiceRatings = async (serviceNames) => {
  if (!serviceNames || serviceNames.length === 0) return [];
  const promises = serviceNames.map(name => fetchRawServiceMetrics(name));
  const rawArr = await Promise.all(promises);
  return rawArr.map(metrics => {
    const up = metrics.thumbs_up_total || 0;
    const neu = metrics.neutral_total || 0;
    const down = metrics.thumbs_down_total || 0;
    const total = up + neu + down;
    return {
      name: metrics.service_name || metrics._id || 'Unknown',
      thumbUp: total > 0 ? (up / total) * 100 : 0,
      neutral: total > 0 ? (neu / total) * 100 : 0,
      thumbDown: total > 0 ? (down / total) * 100 : 0,
    };
  });
};

export const getAllFeedbackMetrics = async () => {
  try {
    const { data } = await axios.get(`/api/route/report/feedbacks`, {
      headers: {
        "Content-Type": "application/json",
        "bksi-api-key": apiKey,
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching feedback metrics:", error.response?.data || error.message);
    throw new Error("Failed to load service metrics.");
  }
};

export default {
  getAllFeedbackMetrics
};