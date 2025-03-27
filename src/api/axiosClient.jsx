import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
// axiosClient.interceptors.request.use(
//   function (config) {
//     // Add Authorization token if available
//     const token = localStorage.getItem('accessToken'); // Adjust storage mechanism if necessary
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   function (error) {
//     // Handle request error
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code within the range of 2xx triggers this function
    // Return only response data
    console.log(`test: ${response}`);
    return response.data;
  },
  function (error) {
    // Handle response errors
    console.error('Response error:', error.response || error.message);
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Handle token refresh or redirect to login.');
      // Add token refresh or redirect logic here
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
