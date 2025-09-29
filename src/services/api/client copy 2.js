// Production-Grade API Client with Auto Session Management
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';

// Environment configuration
const config = {
  api: {
    baseUrl: 'https://localhost:7020',
    timeout: 30000, // 30 seconds
  },
  security: {
    encryptionKey: 'BSEB-IFMS-2024-SECRET-KEY', // Should be from environment
  },
};

// Storage keys
const STORAGE_KEYS = {
  SESSION_ID: 'bseb_session_id',
  USER_DATA: 'bseb_user_data',
  AUTH_TOKEN: 'bseb_auth_token',
  LAST_ACTIVITY: 'bseb_last_activity',
};

// Enhanced encryption utilities
const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), config.security.encryptionKey).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, config.security.encryptionKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText ? JSON.parse(decryptedText) : null;
  } catch (error) {
    console.warn('Decryption failed:', error);
    return null;
  }
};

// Enhanced session management
const sessionManager = {
  get: (key) => {
    try {
      const encryptedData = localStorage.getItem(key);
      return encryptedData ? decrypt(encryptedData) : null;
    } catch (error) {
      console.warn(`Failed to get ${key}:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      const encryptedData = encrypt(value);
      if (encryptedData) {
        localStorage.setItem(key, encryptedData);
        // Update last activity
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`Failed to set ${key}:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove ${key}:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear session:', error);
      return false;
    }
  },

  isExpired: () => {
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    if (!lastActivity) {
      // If no last activity recorded, check if we have session data
      const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return !(sessionId && userData); // Not expired if we have session data
    }

    const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    return Date.now() - parseInt(lastActivity) > sessionTimeout;
  },
};

// Session data accessors
const getSessionId = () => sessionManager.get(STORAGE_KEYS.SESSION_ID);
const setSessionId = (sessionId) => sessionManager.set(STORAGE_KEYS.SESSION_ID, sessionId);
const getUserData = () => sessionManager.get(STORAGE_KEYS.USER_DATA);
const setUserData = (userData) => sessionManager.set(STORAGE_KEYS.USER_DATA, userData);
const clearSession = () => sessionManager.clear();

// Create axios instance with enhanced configuration
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor with enhanced security
apiClient.interceptors.request.use(
  (requestConfig) => {
    const sessionId = getSessionId();
    const startTime = Date.now();

    // Add session ID to headers if available
    if (sessionId) {
      requestConfig.headers['X-Session-Id'] = sessionId;
    }

    // Add security headers
    requestConfig.headers['X-Timestamp'] = startTime;
    requestConfig.headers['X-Client-Version'] = '1.0.0';

    // Add request ID for tracking
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    requestConfig.headers['X-Request-Id'] = requestId;
    requestConfig.metadata = { requestId, startTime };

    // Session expiry check
    // ✅ Session expiry check
    if (
      sessionManager.isExpired() &&
      requestConfig.url !== '/api/Auth/captcha' &&
      !requestConfig.url.includes('/api/Auth/login')
    ) {
      console.warn('Session expired, clearing local data');
      clearSession();
      // यहां redirect मत करो, response interceptor handle करेगा
    }

    // Development logging
    if (import.meta.env.DEV) {
      console.group(`🚀 API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
      console.log('Request ID:', requestId);
      console.log('Headers:', requestConfig.headers);
      if (requestConfig.data && requestConfig.url !== '/api/Auth/login') {
        console.log('Data:', requestConfig.data);
      }
      console.groupEnd();
    }

    return requestConfig;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.metadata?.requestId;
    const duration = Date.now() - response.config.metadata?.startTime;

    // Development logging
    if (import.meta.env.DEV) {
      console.group(`✅ API Response: ${response.config.url} (${duration}ms)`);
      console.log('Request ID:', requestId);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.groupEnd();
    }

    // Auto-store session data from response headers or data
    const newSessionId = response.headers['x-session-id'] || response.data?.sessionId;
    if (newSessionId && newSessionId !== getSessionId()) {
      setSessionId(newSessionId);
      console.log('📝 Session ID updated from response');
    }

    // Auto-store user data if present
    if (response.data?.user) {
      setUserData(response.data.user);
      console.log('👤 User data updated from response');
    }

    // Update last activity timestamp
    sessionManager.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now());

    return response;
  },
  async (error) => {
    const { response, config: requestConfig } = error;
    const requestId = requestConfig?.metadata?.requestId;
    const duration = Date.now() - (requestConfig?.metadata?.startTime || 0);

    // Development error logging
    if (import.meta.env.DEV) {
      console.group(`❌ API Error: ${requestConfig?.url} (${duration}ms)`);
      console.log('Request ID:', requestId);
      console.log('Status:', response?.status);
      console.log('Error:', error.message);
      console.log('Response Data:', response?.data);
      console.groupEnd();
    }

    // Enhanced error handling based on status codes
    if (response) {
      const { status, data } = response;

      switch (status) {
        case 400:
          // Bad Request - Validation errors
          if (data?.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.slice(0, 3).forEach((msg) => {
              // Limit to 3 messages
              toast.error(msg, { duration: 5000 });
            });
          } else if (data?.message) {
            toast.error(data.message, { duration: 5000 });
          } else {
            toast.error('Invalid request. Please check your input.', { duration: 4000 });
          }
          break;

        case 401:
          // Unauthorized - Session expired or invalid
          console.warn('🔐 Authentication failed - clearing session');
          clearSession();
          toast.error('Your session has expired. Please login again.', {
            duration: 6000,
            icon: '🔐',
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }, 2000);
          break;

        case 403:
          // Forbidden - Insufficient permissions
          toast.error('Access denied. You do not have permission for this action.', {
            duration: 5000,
            icon: '🚫',
          });
          break;

        case 404:
          // Not Found
          if (!requestConfig?.silent) {
            toast.error('Requested resource not found.', { duration: 4000 });
          }
          break;

        case 409:
          // Conflict - Usually duplicate data
          toast.error(data?.message || 'Data conflict occurred. Please refresh and try again.', {
            duration: 5000,
          });
          break;

        case 422:
          // Unprocessable Entity - Validation failed
          if (data?.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.slice(0, 2).forEach((msg) => {
              toast.error(msg, { duration: 5000 });
            });
          } else {
            toast.error(data?.message || 'Validation failed. Please check your input.', {
              duration: 4000,
            });
          }
          break;

        case 429: {
          // ⏳ Too Many Requests - Rate limiting
          const retryAfterHeader = response.headers?.['retry-after'];
          let waitTimeMessage = 'a moment';

          if (retryAfterHeader) {
            // retry-after कभी number (seconds) होता है, कभी date (timestamp)
            const retryAfterSeconds = parseInt(retryAfterHeader, 10);
            if (!isNaN(retryAfterSeconds)) {
              waitTimeMessage = `${retryAfterSeconds} second${retryAfterSeconds > 1 ? 's' : ''}`;
            } else {
              waitTimeMessage = `until ${new Date(retryAfterHeader).toLocaleTimeString()}`;
            }
          }

          toast.error(`⏳ Too many requests. Please wait ${waitTimeMessage} and try again.`, {
            duration: 8000,
          });
          break;
        }

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error(
            'Server error occurred. Our team has been notified. Please try again later.',
            {
              duration: 6000,
              icon: '🔧',
            }
          );
          break;

        default:
          if (!requestConfig?.silent) {
            toast.error(data?.message || `Request failed with status ${status}`, {
              duration: 4000,
            });
          }
      }
    } else {
      // Network or other errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Request timeout. Please check your connection and try again.', {
          duration: 5000,
          icon: '⏱️',
        });
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error('Network connection failed. Please check your internet connection.', {
          duration: 6000,
          icon: '🌐',
        });
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
          duration: 4000,
        });
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced CAPTCHA fetching with retry logic
const fetchCaptcha = async (retryCount = 0) => {
  try {
    console.log(`🔄 Fetching CAPTCHA (attempt ${retryCount + 1})...`);

    const response = await apiClient.get('/api/Auth/captcha', {
      timeout: 15000, // 15 seconds for CAPTCHA
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (!response.data?.image || !response.data?.sessionId) {
      throw new Error('Invalid CAPTCHA response from server');
    }

    console.log('✅ CAPTCHA fetched successfully:', {
      hasImage: !!response.data.image,
      sessionId: response.data.sessionId?.substring(0, 20) + '...',
      expiresIn: response.data.expiresInSeconds || 300,
    });

    return response.data;
  } catch (error) {
    console.error(`❌ CAPTCHA fetch failed (attempt ${retryCount + 1}):`, error);

    // Retry logic for CAPTCHA
    if (retryCount < 2 && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
      console.log(`🔄 Retrying CAPTCHA fetch in ${(retryCount + 1) * 2} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 2000));
      return fetchCaptcha(retryCount + 1);
    }

    throw new Error(error.response?.data?.message || 'Failed to load security verification');
  }
};

// Production-grade API object
export const api = {
  // Enhanced CAPTCHA method
  getCaptcha: fetchCaptcha,

  // Enhanced authentication methods
  login: async (credentials) => {
    // Input validation
    const requiredFields = ['sessionId', 'captcha', 'password'];
    for (const field of requiredFields) {
      if (!credentials[field]) {
        throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    }

    // Build query parameters exactly as working version
    const queryParams = new URLSearchParams({
      sessionId: credentials.sessionId,
      captcha: credentials.captcha,
    });

    // Build request body exactly as working version
    const loginData = {
      id: 0,
      username: credentials.username || credentials.email || '',
      password_hash: credentials.password,
      email: credentials.email || '',
      role: credentials.role || '',
      department: credentials.department || '',
      created_at: new Date().toISOString(),
    };

    try {
      console.log('🔐 Login request:', {
        url: `/api/Auth/login?${queryParams}`,
        username: loginData.username,
        email: loginData.email,
        hasPassword: !!loginData.password_hash,
        sessionId: credentials.sessionId?.substring(0, 20) + '...',
      });

      // Make API call with exact same structure as working version
      const response = await apiClient.post(`/api/Auth/login?${queryParams}`, loginData, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        timeout: 20000, // 20 seconds for login
      });

      console.log('✅ Login API successful:', {
        status: response.status,
        hasData: !!response.data,
        hasUser: !!response.data?.user,
        hasSessionId: !!response.data?.sessionId,
      });

      return response;
    } catch (error) {
      console.error('🚫 Login API failed:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Enhanced logout
  logout: async () => {
    try {
      console.log('🔄 Logout request...');
      await apiClient.post(
        '/api/Auth/logout',
        {},
        {
          timeout: 10000,
          silent: true, // Don't show error toasts for logout
        }
      );
      console.log('✅ Logout API successful');
    } catch (error) {
      console.warn('⚠️ Logout API failed:', error.message);
      // Continue with local cleanup even if API fails
    } finally {
      clearSession();
    }
  },

  // Session validation
  // Session validation - simplified version
  // Session validation - Local check only
  validateSession: async () => {
    try {
      const sessionId = getSessionId();
      const userData = getUserData();

      if (!sessionId || !userData) {
        console.warn('Session validation failed: Missing session data');
        return false;
      }

      if (sessionManager.isExpired()) {
        console.warn('Session validation failed: Session expired');
        return false;
      }

      console.log('✅ Session validation successful');
      return true;
    } catch (error) {
      console.warn('Session validation failed:', error.message);
      return false;
    }
  },
  // Authentication status
  isAuthenticated: () => {
    const sessionId = getSessionId();
    const userData = getUserData();
    return !!(sessionId && userData && !sessionManager.isExpired());
  },

  // Get current user with validation
  getCurrentUser: () => {
    if (sessionManager.isExpired()) {
      clearSession();
      return null;
    }
    return getUserData();
  },

  // Session management utilities
  refreshSession: () => {
    sessionManager.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
  },

  // Generic HTTP methods with enhanced error handling
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // File upload with progress tracking
  upload: (url, formData, onUploadProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for uploads
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted, progressEvent);
        }
      },
    });
  },

  // Batch requests
  batch: async (requests) => {
    try {
      const responses = await Promise.allSettled(requests.map((req) => apiClient.request(req)));
      return responses;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  },
};

// Export session management functions
export {
  getSessionId,
  setSessionId,
  getUserData,
  setUserData,
  clearSession,
  encrypt,
  decrypt,
  sessionManager,
};

export default apiClient;
