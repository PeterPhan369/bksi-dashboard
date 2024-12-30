import axiosClient from "./axiosClient";

const dataApi = {
  getAll: () => {
    const url = '/services';
    // Example of sending a request body (you can modify this as per your need)
    const requestBody = {
      service: 'Manage',
    };

    return axiosClient.post(url, requestBody);
  },
};

export default dataApi;