import { api } from './client';
import { API_ENDPOINTS } from '@utils/constants';

export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/Dashboard/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
      };
    }
  },

  // Get recent invoices
  getRecentInvoices: async (limit = 5) => {
    try {
      const response = await api.get(`/api/Dashboard/recent-invoices?limit=${limit}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent invoices',
      };
    }
  },

  // Get pending approvals
  getPendingApprovals: async () => {
    try {
      const response = await api.get('/api/Dashboard/pending-approvals');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch pending approvals',
      };
    }
  },

  // Get payment summary
  getPaymentSummary: async (period = 'month') => {
    try {
      const response = await api.get(`/api/Dashboard/payment-summary?period=${period}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payment summary',
      };
    }
  },

  // Get monthly revenue chart data
  getRevenueChart: async (months = 6) => {
    try {
      const response = await api.get(`/api/Dashboard/revenue-chart?months=${months}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue chart data',
      };
    }
  },
};
