// store/slices/vendorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorAPI } from '@/services/api/client';

// Async Thunks
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.getVendors();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendors/createVendor',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.createVendor(vendorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vendor');
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.updateVendor(id, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vendor');
    }
  }
);

// Slice
const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    items: [],
    selectedVendor: null,
    loading: false,
    error: null,
    filters: {
      department: null,
      status: 'all',
      search: '',
    },
  },
  reducers: {
    setSelectedVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    setVendorFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearVendorError: (state) => {
      state.error = null;
    },
    resetVendors: (state) => {
      state.items = [];
      state.selectedVendor = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedVendor?.id === action.payload.id) {
          state.selectedVendor = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedVendor, setVendorFilters, clearVendorError, resetVendors } =
  vendorSlice.actions;

export default vendorSlice.reducer;
