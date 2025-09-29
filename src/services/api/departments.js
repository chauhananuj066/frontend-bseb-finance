import axios from 'axios';

const BASE_URL = 'https://localhost:7020/api';

export const departmentAPI = {
  // Get all departments
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/User/departments`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch departments');
    }
  },

  // Get department by ID
  getById: async (id) => {
    try {
      const departments = await departmentAPI.getAll();
      return departments.find((d) => d.id === id);
    } catch (error) {
      throw new Error('Failed to fetch department');
    }
  },
};
