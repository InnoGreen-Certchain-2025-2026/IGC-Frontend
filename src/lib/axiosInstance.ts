import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const persisted = localStorage.getItem("persist:root");
    if (persisted) {
      const root = JSON.parse(persisted);
      const auth = JSON.parse(root.auth);
      if (auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

export default axiosInstance;

