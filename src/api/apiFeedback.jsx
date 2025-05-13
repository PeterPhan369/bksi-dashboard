// src/api/apiFeedback.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

/**
 * Fetch rating distribution for a single service.
 * Hits: GET /metrics/:service_name?days=…
 * Returns { _id, name, thumbUp, neutral, thumbDown }
 */
export const fetchServiceRatings = async (serviceName, days) => {
  try {
    const params = {};
    if (typeof days === 'number') params.days = days;

    const { data: metrics } = await axios.get(
      `${API_BASE_URL}/metrics/${encodeURIComponent(serviceName)}`,
      { params }
    );

    const { thumbs_up_total = 0, neutral_total = 0, thumbs_down_total = 0 } = metrics;
    const total = thumbs_up_total + neutral_total + thumbs_down_total;

    return {
      _id: serviceName,
      name: serviceName,
      thumbUp: total > 0 ? (thumbs_up_total / total) * 100 : 0,
      neutral: total > 0 ? (neutral_total / total) * 100 : 0,
      thumbDown: total > 0 ? (thumbs_down_total / total) * 100 : 0,
    };
  } catch (error) {
    console.error(`Error fetching ratings for ${serviceName}:`, error);
    throw error;
  }
};

/**
 * Fetch rating distributions for *multiple* services in parallel.
 * @param {string[]} serviceNames – list of service_name strings.
 * @param {number} [days]        – optional window for metrics.
 * @returns Promise<array of { _id, name, thumbUp, neutral, thumbDown }>
 */
export const fetchAllServiceRatings = async (serviceNames, days) => {
  // serviceNames could come from your app config or another API
  const calls = serviceNames.map(name => fetchServiceRatings(name, days));
  return Promise.all(calls);
};

/**
 * Fetch usage/rejection metrics for a single service.
 * Hits: GET /metrics/:service_name?days=…
 * Returns { _id, name, usageRate }
 */
export const fetchUsages = async (serviceName, days) => {
  try {
    const params = {};
    if (typeof days === 'number') params.days = days;

    const { data: metrics } = await axios.get(
      `${API_BASE_URL}/metrics/${encodeURIComponent(serviceName)}`,
      { params }
    );

    const usageTotal     = metrics.usage_total   || 0;
    const rejectionTotal = metrics.rejection_total || 0;
    const total          = usageTotal + rejectionTotal;

    return {
      _id: serviceName,
      name: serviceName,
      usageRate: total > 0 ? (usageTotal / total) * 100 : 0,
    };
  } catch (error) {
    console.error(`Error fetching usage metrics for ${serviceName}:`, error);
    throw error;
  }
};

/**
 * Fetch the latest “suggestion” feedback items for a service.
 * Hits: GET /suggestions/:service_name?limit=…
 * Returns array of { text, timestamp }
 */
export const fetchSuggestions = async (serviceName, limit) => {
  try {
    const params = {};
    if (typeof limit === 'number') params.limit = limit;

    const { data } = await axios.get(
      `${API_BASE_URL}/suggestions/${encodeURIComponent(serviceName)}`,
      { params }
    );

    // backend returns { value, timestamp } objects
    return data.map(item => ({
      text: item.value,
      timestamp: item.timestamp,
    }));
  } catch (error) {
    console.error(`Error fetching suggestions for ${serviceName}:`, error);
    throw error;
  }
};
