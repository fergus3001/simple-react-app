import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://localhost:6001',
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      // You could redirect to login page here
    }
    return Promise.reject(error);
  }
);

// Weather forecast service
export const weatherService = {
  getForecasts: () => api.get('/weatherforecast'),
};

// Auth service
export const authService = {
  authenticate: (idToken) => api.post('/user/authenticate', { idToken }),
};

export default api;