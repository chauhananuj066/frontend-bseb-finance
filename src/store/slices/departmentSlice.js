// store/slices/departmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentAPI } from '@/services/api/client';

// Async Thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.getDepartments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.createDepartment(departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.updateDepartment(id, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

// Slice
const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    items: [],
    selectedDepartment: null,
    loading: false,
    error: null,
    filters: {
      status: 'all',
      search: '',
    },
  },
  reducers: {
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    setDepartmentFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearDepartmentError: (state) => {
      state.error = null;
    },
    resetDepartments: (state) => {
      state.items = [];
      state.selectedDepartment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Department
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedDepartment?.id === action.payload.id) {
          state.selectedDepartment = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedDepartment,
  setDepartmentFilters,
  clearDepartmentError,
  resetDepartments,
} = departmentSlice.actions;

export default departmentSlice.reducer;
