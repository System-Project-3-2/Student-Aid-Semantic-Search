/**
 * Feedback Service
 * Handles all feedback-related API calls
 */
import api from './api';

const feedbackService = {
  /**
   * Create new feedback (Student only)
   * @param {Object} feedbackData - { title, message, category }
   * @returns {Promise} API response with created feedback
   */
  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedbacks', feedbackData);
    return response.data;
  },

  /**
   * Get student's own feedbacks
   * @returns {Promise} API response with feedbacks array
   */
  getMyFeedbacks: async () => {
    const response = await api.get('/feedbacks/my-feedbacks');
    return response.data;
  },

  /**
   * Get all feedbacks (Teacher/Admin only)
   * @returns {Promise} API response with all feedbacks
   */
  getAllFeedbacks: async () => {
    const response = await api.get('/feedbacks');
    return response.data;
  },

  /**
   * Respond to feedback (Teacher/Admin only)
   * @param {string} feedbackId - Feedback ID
   * @param {string} response - Response message
   * @returns {Promise} API response with updated feedback
   */
  respondToFeedback: async (feedbackId, responseMessage) => {
    const response = await api.put(`/feedbacks/${feedbackId}/respond`, {
      response: responseMessage,
    });
    return response.data;
  },
};

export default feedbackService;
