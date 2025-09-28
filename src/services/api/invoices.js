import { api } from './client';
import { API_ENDPOINTS } from '@utils/constants';

export const invoicesAPI = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.INVOICES.LIST);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch invoices',
      };
    }
  },

  // Get single invoice
  getInvoice: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVOICES.GET(id));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch invoice',
      };
    }
  },

  // Create invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.CREATE, invoiceData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create invoice',
      };
    }
  },

  // Update invoice
  updateInvoice: async (invoiceData) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.UPDATE, invoiceData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update invoice',
      };
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.DELETE, { id });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete invoice',
      };
    }
  },

  // Update invoice status
  updateInvoiceStatus: async (id, status, remark = '') => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.STATUS, {
        id,
        status,
        remark,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update invoice status',
      };
    }
  },

  // Return invoice
  returnInvoice: async (id, remark) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.RETURN, null, {
        params: { id, remark },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to return invoice',
      };
    }
  },

  // Get invoices by status
  getInvoicesByStatus: async (status) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVOICES.BY_STATUS(status));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch invoices by status',
      };
    }
  },

  // Get invoices by vendor
  getInvoicesByVendor: async (vendorId) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVOICES.BY_VENDOR(vendorId));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch vendor invoices',
      };
    }
  },

  // Get invoices by department and status
  getInvoicesByDepartmentAndStatus: async (departmentId, status) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVOICES.BY_DEPARTMENT(departmentId, status));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch department invoices',
      };
    }
  },

  // Recommend invoice to department
  recommendInvoice: async (id, departmentId, remark, updatedBy) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVOICES.RECOMMEND(id), null, {
        params: {
          departmentId,
          remark,
          updatedBy,
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to recommend invoice',
      };
    }
  },

  // Upload invoice file
  uploadInvoiceFile: async (file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload('/api/Invoice/upload', formData, onUploadProgress);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload file',
      };
    }
  },
};
