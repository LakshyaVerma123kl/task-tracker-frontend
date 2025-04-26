import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Interceptor - Token from localStorage:", token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Interceptor - Request headers:", config.headers); // Debug log
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("API baseURL:", import.meta.env.VITE_API_URL);

export default api;
