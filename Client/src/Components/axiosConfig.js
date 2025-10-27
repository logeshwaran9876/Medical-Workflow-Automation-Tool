
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for messages
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add it to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication error: Token expired or invalid. Redirecting to login.");
      localStorage.removeItem('authToken'); // Clear invalid token
      localStorage.removeItem('user'); // Clear user data
      window.location.href = '/'; // Or '/login' if you have a dedicated login route
      toast.error("Your session has expired. Please log in again.");
    } else if (error.response && error.response.status === 403) {
        console.error("Authorization error: Not permitted for this role.");
        toast.error("You are not authorized to perform this action.");
    }
    return Promise.reject(error);
  }
);