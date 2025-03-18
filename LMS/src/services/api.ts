import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config?.headers?.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};

// Leave API calls
export const leaveAPI = {
  submitRequest: async (leaveData: any) => {
    const response = await api.post("/leave/request", leaveData);
    return response.data;
  },
  getRequests: async () => {
    const response = await api.get("/leave/requests");
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get("/leave/history");
    return response.data;
  },
  getLeaveBalance: async () => {
    const response = await api.get("/leave/balance");
    return response.data;
  },
  updateRequest: async (id: number, data: any) => {
    const response = await api.put(`/leave/${id}`, data);
    return response.data;
  },
  cancelRequest: async (id: number) => {
    const response = await api.delete(`/leave/${id}`);
    return response.data;
  },
};

export default api;
