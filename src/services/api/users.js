import { api } from './client';
import { API_ENDPOINTS } from '@utils/constants';

export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.LIST);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  // Get single user
  getUser: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.GET(id));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  // Create user
  createUser: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user',
      };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.UPDATE(id), userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user',
      };
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.DELETE(id));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },

  // Get departments
  getDepartments: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.DEPARTMENTS);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch departments',
      };
    }
  },
};

// Department API
export const departmentsAPI = {
  // Get all departments
  getAllDepartments: async () => {
    try {
      const response = await api.get('/api/User/departments');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch departments',
      };
    }
  },

  // Create department
  createDepartment: async (deptData) => {
    try {
      const response = await api.post('/api/User/departments/create', deptData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create department',
      };
    }
  },

  // Update department
  updateDepartment: async (id, deptData) => {
    try {
      const response = await api.post(`/api/User/departments/update/${id}`, deptData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update department',
      };
    }
  },

  // Delete department
  deleteDepartment: async (id) => {
    try {
      const response = await api.post(`/api/User/departments/delete/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete department',
      };
    }
  },
};
