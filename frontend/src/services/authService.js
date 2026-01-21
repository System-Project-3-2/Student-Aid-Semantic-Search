/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} API response with token and user data
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Verify OTP after registration
   * @param {Object} otpData - { email, otp }
   * @returns {Promise} API response
   */
  verifyOtp: async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
  },

  /**
   * Logout user - clears local storage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from local storage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get auth token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
