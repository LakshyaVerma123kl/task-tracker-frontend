import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add debug log to confirm baseURL
console.log("API baseURL:", import.meta.env.VITE_API_URL);

export default api;
