import axios from 'axios';

const BASE_URL = 'https://localhost:7020/api';

export const workOrderAPI = {
  // Get all work orders
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/WorkOrders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch work orders');
    }
  },

  // Get work order by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/WorkOrders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch work order');
    }
  },

  // Create new work order
  create: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/WorkOrders/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create work order');
    }
  },

  // Update work order
  update: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/WorkOrders/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update work order');
    }
  },

  // Delete work order
  delete: async (id) => {
    try {
      const response = await axios.post(`${BASE_URL}/WorkOrders/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete work order');
    }
  },
};
