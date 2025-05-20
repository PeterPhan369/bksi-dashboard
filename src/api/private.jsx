import axios from "axios";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // attach cookies
});

const useAxiosPrivate = () => {
  useEffect(() => {
    const responseIntercept = api.interceptors.response.use(
      res => res,
      async err => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await api.get("/refresh"); // refresh token from cookie
            return api(originalRequest); // retry original request
          } catch (refreshError) {
            console.error("🔁 Refresh failed:", refreshError);
            // optional: redirect to login
          }
        }

        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return api;
};

export default useAxiosPrivate;
