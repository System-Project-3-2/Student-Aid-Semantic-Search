/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

// Create context with default values
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  verifyOtp: async () => {},
  updateUser: () => {},
});

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (storedUser && token) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   * @param {Object} credentials - { email, password }
   */
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  }, []);


  /**
   * Register handler
   * @param {Object} userData - { name, email, password }
   */
  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    return data;
  }, []);

  /**
   * Verify OTP handler
   * @param {Object} otpData - { email, otp }
   */
  const verifyOtp = useCallback(async (otpData) => {
    const data = await authService.verifyOtp(otpData);
    return data;
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    verifyOtp,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
