import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://localhost:6001',  // Update with your .NET Core API URL
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Weather forecast service
export const weatherService = {
  getForecasts: () => api.get('/weatherforecast'),
};

export default api;