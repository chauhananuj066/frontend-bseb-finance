// Enhanced Production-Grade Auth Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api/client.js';
import { toast } from 'react-hot-toast';

// Enhanced async thunk for CAPTCHA with error handling
export const getCaptchaAsync = createAsyncThunk(
  'auth/getCaptcha',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🔄 Fetching new CAPTCHA...');
      const captchaData = await api.getCaptcha();

      console.log('✅ CAPTCHA loaded:', {
        hasImage: !!captchaData.image,
        hasSessionId: !!captchaData.sessionId,
        expiresIn: captchaData.expiresInSeconds || 300,
      });

      return captchaData;
    } catch (error) {
      console.error('❌ CAPTCHA fetch failed:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to load security verification';
      return rejectWithValue(errorMessage);
    }
  }
);

// Production-grade login async thunk
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log('🚀 Login attempt started...', {
        email: credentials.email,
        hasPassword: !!credentials.password,
        hasCaptcha: !!credentials.captcha,
        hasSessionId: !!credentials.sessionId,
      });

      // Validate required credentials
      if (!credentials.email) {
        throw new Error('Email is required');
      }
      if (!credentials.password) {
        throw new Error('Password is required');
      }
      if (!credentials.captcha) {
        throw new Error('Security code is required');
      }
      if (!credentials.sessionId) {
        throw new Error('Security session is required');
      }

      // Call API login method
      const response = await api.login(credentials);

      console.log('✅ Login API response:', {
        hasUser: !!response.data?.user,
        hasSessionId: !!response.data?.sessionId,
        hasToken: !!response.data?.token,
      });

      // Structure the success response
      // Structure the success response
      const loginResponse = {
        user: {
          id: response.data?.userId, // ✅ userId -> id
          email: response.data?.email, // ✅ Direct from API
          username: response.data?.email, // ✅ Use email as username
          role: response.data?.role, // ✅ Direct from API
          department: response.data?.department, // ✅ Direct from API
        },
        sessionId: response.data?.sessionId || credentials.sessionId,
        token: response.data?.token,
        timestamp: new Date().toISOString(),
      };

      return loginResponse;
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

      // Enhanced error handling with specific messages
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.status === 400) {
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errorMessage = errors.join(', ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = 'Invalid credentials or security code. Please check and try again.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait and try again later.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please contact support if this continues.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      // Auto-refresh CAPTCHA on login failure
      if (error.response?.status === 400) {
        console.log('🔄 Refreshing CAPTCHA after login failure...');
        dispatch(getCaptchaAsync());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Enhanced logout with cleanup
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('🔄 Logging out...');

      // Call API logout (handles session cleanup)
      await api.logout();

      console.log('✅ Logout successful');
      toast.success('Logged out successfully', { duration: 2000 });

      return {};
    } catch (error) {
      console.warn('⚠️ Logout API failed, but clearing local session:', error);
      // Even if API fails, we should clear local state
      return {};
    }
  }
);

// Session validation async thunk
export const validateSessionAsync = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.isAuthenticated || !auth.sessionId) {
        throw new Error('No active session');
      }

      // Check if session is still valid with backend
      const isValid = await api.validateSession();

      if (!isValid) {
        throw new Error('Session expired');
      }

      return { valid: true, timestamp: new Date().toISOString() };
    } catch (error) {
      console.warn('⚠️ Session validation failed:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Production-grade auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // User data
    user: null,
    sessionId: null,

    // CAPTCHA state
    captcha: {
      image: null,
      sessionId: null,
      expiresInSeconds: 300,
      issuedAtUtc: null,
      retryCount: 0,
    },

    // Authentication state
    isAuthenticated: false,
    lastLoginAt: null,
    sessionExpiresAt: null,

    // Loading states
    loading: false,
    captchaLoading: false,

    // Error handling
    error: null,
    lastError: null,
    errorCount: 0,

    // Feature flags
    rememberMe: false,
    autoRefreshCaptcha: true,

    // Security
    loginAttempts: 0,
    maxLoginAttempts: 5,
    lockoutUntil: null,
  },

  reducers: {
    // Clear all errors
    clearError: (state) => {
      state.error = null;
      state.lastError = null;
    },

    // Clear authentication state
    clearAuth: (state) => {
      state.user = null;
      state.sessionId = null;
      state.isAuthenticated = false;
      state.lastLoginAt = null;
      state.sessionExpiresAt = null;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutUntil = null;
      state.captcha = {
        image: null,
        sessionId: null,
        expiresInSeconds: 300,
        issuedAtUtc: null,
        retryCount: 0,
      };
    },

    // Set CAPTCHA data
    setCaptcha: (state, action) => {
      state.captcha = {
        ...action.payload,
        retryCount: state.captcha.retryCount,
      };
    },

    // Increment login attempts
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      if (state.loginAttempts >= state.maxLoginAttempts) {
        state.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes lockout
      }
    },

    // Reset login attempts
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lockoutUntil = null;
    },

    // Set remember me preference
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },

    // Restore session from storage
    restoreSession: (state, action) => {
      const { user, sessionId, timestamp } = action.payload;
      state.user = user;
      state.sessionId = sessionId;
      state.isAuthenticated = true;
      state.lastLoginAt = timestamp;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get CAPTCHA cases
      .addCase(getCaptchaAsync.pending, (state) => {
        state.captchaLoading = true;
        state.error = null;
      })
      .addCase(getCaptchaAsync.fulfilled, (state, action) => {
        state.captchaLoading = false;
        state.captcha = {
          ...action.payload,
          retryCount: 0,
        };
        state.error = null;
      })
      .addCase(getCaptchaAsync.rejected, (state, action) => {
        state.captchaLoading = false;
        state.error = action.payload;
        state.lastError = action.payload;
        state.errorCount += 1;
        state.captcha.retryCount += 1;
      })

      // Login cases
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.sessionId = action.payload.sessionId;
        state.isAuthenticated = true;
        state.lastLoginAt = action.payload.timestamp;
        state.sessionExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours from now
        state.error = null;
        state.loginAttempts = 0; // Reset attempts on successful login
        state.lockoutUntil = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastError = action.payload;
        state.errorCount += 1;
        state.isAuthenticated = false;
        state.user = null;
        state.sessionId = null;
        state.loginAttempts += 1;

        // Set lockout if max attempts reached
        if (state.loginAttempts >= state.maxLoginAttempts) {
          state.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        }
      })

      // Logout cases
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.lastLoginAt = null;
        state.sessionExpiresAt = null;
        state.error = null;
        state.loginAttempts = 0;
        state.lockoutUntil = null;
        state.captcha = {
          image: null,
          sessionId: null,
          expiresInSeconds: 300,
          issuedAtUtc: null,
          retryCount: 0,
        };
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Even if logout API fails, clear local state
        state.user = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.lastLoginAt = null;
        state.sessionExpiresAt = null;
      })

      // Session validation cases
      .addCase(validateSessionAsync.fulfilled, (state, action) => {
        // Session is valid, update timestamp
        state.lastLoginAt = action.payload.timestamp;
      })
      .addCase(validateSessionAsync.rejected, (state) => {
        // Session invalid, clear auth state
        state.user = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.lastLoginAt = null;
        state.sessionExpiresAt = null;
      });
  },
});

// Export actions
export const {
  clearError,
  clearAuth,
  setCaptcha,
  incrementLoginAttempts,
  resetLoginAttempts,
  setRememberMe,
  restoreSession,
} = authSlice.actions;

// Selectors for better performance
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCaptcha = (state) => state.auth.captcha;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsLocked = (state) => {
  if (!state.auth.lockoutUntil) return false;
  return new Date(state.auth.lockoutUntil) > new Date();
};

export default authSlice.reducer;
