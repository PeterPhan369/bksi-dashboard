import axiosClient from "./axiosClient";

const dataApi = {
  getAll: (params) => {
    const url = '/datas';
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/datas/${id}`;
    return axiosClient.get(url);
  },
}

export default dataApi;