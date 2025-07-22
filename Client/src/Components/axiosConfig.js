// 📄 src/axiosConfig.js
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for messages

// Request interceptor to add the JWT token to headers
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

// Response interceptor to handle token expiration or invalidity
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to authentication (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Authentication error: Token expired or invalid. Redirecting to login.");
      localStorage.removeItem('authToken'); // Clear invalid token
      localStorage.removeItem('user'); // Clear user data
      // Redirect to login page (adjust path as needed for your router)
      // Using window.location.href for simplicity, but navigate hook is better if available at this global level
      window.location.href = '/'; // Or '/login' if you have a dedicated login route
      toast.error("Your session has expired. Please log in again.");
    } else if (error.response && error.response.status === 403) {
        console.error("Authorization error: Not permitted for this role.");
        toast.error("You are not authorized to perform this action.");
    }
    return Promise.reject(error);
  }
);