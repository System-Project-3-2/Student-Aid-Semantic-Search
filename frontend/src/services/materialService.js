/**
 * Material Service
 * Handles all material-related API calls
 */
import api from './api';

const materialService = {
  /**
   * Get all materials (role-based: teacher sees own, admin/student sees all)
   * @returns {Promise} API response with materials array
   */
  getAllMaterials: async () => {
    const response = await api.get('/materials');
    return response.data;
  },

  /**
   * Get a single material by ID
   * @param {string} materialId - Material ID
   * @returns {Promise} API response with material data
   */
  getMaterialById: async (materialId) => {
    const response = await api.get(`/materials/${materialId}`);
    return response.data;
  },

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
   * Update a material (Teacher - own only, Admin - any)
   * @param {string} materialId - Material ID to update
   * @param {Object} data - Updated material data
   * @returns {Promise} API response
   */
  updateMaterial: async (materialId, data) => {
    const response = await api.put(`/materials/${materialId}`, data);
    return response.data;
  },

  /**
   * Delete a material by ID (Teacher - own only, Admin - any)
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
