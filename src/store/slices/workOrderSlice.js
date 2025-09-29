// store/slices/workOrderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workOrderApi } from '@/services/api/client';

// Async thunks
export const fetchWorkOrders = createAsyncThunk(
  'workOrders/fetchWorkOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workOrderApi.getWorkOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch work orders');
    }
  }
);

export const createWorkOrder = createAsyncThunk(
  'workOrders/createWorkOrder',
  async (workOrderData, { rejectWithValue }) => {
    try {
      const response = await workOrderApi.createWorkOrder(workOrderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create work order');
    }
  }
);

const workOrderSlice = createSlice({
  name: 'workOrders',
  initialState: {
    items: [],
    selectedWorkOrder: null,
    loading: false,
    error: null,
    filters: {
      department: null,
      vendor: null,
      status: 'all',
      dateRange: null,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    setSelectedWorkOrder: (state, action) => {
      state.selectedWorkOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetWorkOrders: (state) => {
      state.items = [];
      state.selectedWorkOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWorkOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createWorkOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedWorkOrder, setFilters, clearError, resetWorkOrders } =
  workOrderSlice.actions;

export default workOrderSlice.reducer;
