import axiosClient from './axiosClient'; // Adjust the import path to your setup

const userApi = {
  getMe: () => {
    // Call API to get the current user
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(async () => {
        try {
          // Example API call to fetch current user info
          const response = await axiosClient.get('/me'); // Replace '/me' with your actual endpoint
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to fetch user data.'));
        }
      }, 500);
    });
  },
};

export default userApi;
