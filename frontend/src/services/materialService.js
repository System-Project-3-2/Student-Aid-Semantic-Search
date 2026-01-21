/**
 * Material Service
 * Handles all material-related API calls
 */
import api from './api';

const materialService = {
  /**
   * Upload a new material (Teacher/Admin only)
   * @param {FormData} formData - Contains file, title, course, type
   * @returns {Promise} API response with created material
   */
  uploadMaterial: async (formData) => {
    const response = await api.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete a material by ID (Teacher/Admin only)
   * @param {string} materialId - Material ID to delete
   * @returns {Promise} API response
   */
  deleteMaterial: async (materialId) => {
    const response = await api.delete(`/materials/${materialId}`);
    return response.data;
  },

  /**
   * Search materials using semantic search
   * @param {Object} searchParams - { query, course?, type? }
   * @returns {Promise} API response with search results
   */
  searchMaterials: async (searchParams) => {
    const response = await api.post('/search', searchParams);
    return response.data;
  },
};

export default materialService;
