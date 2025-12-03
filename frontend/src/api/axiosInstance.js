import axios from "axios";

const base_url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
