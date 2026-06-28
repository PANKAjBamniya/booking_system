const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors uniformly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const errors = error.response?.data?.errors || null;
    
    // Return custom error format
    return Promise.reject({
      message,
      errors,
      status: error.response?.status,
    });
  }
);

export default apiClient;
