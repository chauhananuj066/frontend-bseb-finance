// store/slices/invoiceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workOrderApi } from '@/services/api/client';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async ({ departmentId, status }, { rejectWithValue }) => {
    try {
      let response;
      if (departmentId && status !== undefined) {
        response = await workOrderApi.getInvoicesByDepartment(departmentId, status);
      } else {
        response = await workOrderApi.getInvoices();
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const submitInvoice = createAsyncThunk(
  'invoices/submitInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await workOrderApi.submitInvoice(invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    items: [],
    selectedInvoice: null,
    loading: false,
    error: null,
    statusOptions: [
      { value: 0, label: 'Submitted', color: 'primary' },
      { value: 1, label: 'Under Review', color: 'warning' },
      { value: 2, label: 'Verified', color: 'info' },
      { value: 5, label: 'Recommended', color: 'success' },
      { value: 9, label: 'Approved', color: 'success' },
      { value: -1, label: 'Returned', color: 'danger' },
    ],
    filters: {
      status: 'all',
      department: null,
      vendor: null,
      dateRange: null,
    },
  },
  reducers: {
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status, remark } = action.payload;
      const invoice = state.items.find((inv) => inv.id === id);
      if (invoice) {
        invoice.status = status;
        if (remark) invoice.remark = remark;
      }
    },
    setInvoiceFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearInvoiceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedInvoice, updateInvoiceStatus, setInvoiceFilters, clearInvoiceError } =
  invoiceSlice.actions;

export default invoiceSlice.reducer;
