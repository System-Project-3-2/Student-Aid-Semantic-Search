/**
 * useApi Hook
 * Provides a reusable way to handle API calls with loading and error states
 */
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show success toast
 * @param {string} options.successMessage - Custom success message
 * @param {boolean} options.showErrorToast - Show error toast
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    showSuccessToast = false,
    successMessage = 'Operation successful!',
    showErrorToast = true,
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        setData(result);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, showSuccessToast, successMessage, showErrorToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

export default useApi;
