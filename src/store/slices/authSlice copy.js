import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@services/api/auth';
import { setToken, removeToken, encrypt, decrypt } from '@services/api/client';
import { STORAGE_KEYS } from '@utils/constants';

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authAPI.login(credentials);
      if (result.success) {
        // Store token securely
        setToken(result.data.token);

        // Store user data encrypted
        const encryptedUser = encrypt(result.data.user);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, encryptedUser);

        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    removeToken();
    return null;
  } catch (error) {
    // Even if API call fails, remove local storage
    removeToken();
    return null;
  }
});

// Initial state
const getInitialState = () => {
  try {
    const encryptedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const user = encryptedUser ? decrypt(encryptedUser) : null;

    return {
      user: user,
      isAuthenticated: !!user,
      loading: false,
      error: null,
    };
  } catch (error) {
    removeToken();
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      const encryptedUser = encrypt(state.user);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, encryptedUser);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
