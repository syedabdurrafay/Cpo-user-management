import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // ✅ added /api
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('police_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem('police_token');
        localStorage.removeItem('police_user');
        window.location.href = '/login';
      } else if (status === 404) {
        console.error('Endpoint not found:', error.config.url);
        return Promise.reject(new Error('The requested resource was not found'));
      } else if (status === 500) {
        console.error('Server error:', data.message);
        return Promise.reject(new Error('Internal server error'));
      }

      return Promise.reject(new Error(data?.message || 'An unexpected error occurred'));
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject(new Error('Network error - no response from server'));
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(new Error('Error setting up request'));
    }
  }
);

export default API;
