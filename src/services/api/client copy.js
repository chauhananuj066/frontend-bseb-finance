import axios from 'axios';
import { toast } from 'react-hot-toast';
import { config } from '@config/environment';
import { STORAGE_KEYS } from '@utils/constants';
import CryptoJS from 'crypto-js';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Encryption utilities
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), config.security.encryptionKey).toString();
};

const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, config.security.encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

// Token management
const getToken = () => {
  const encryptedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return encryptedToken ? decrypt(encryptedToken) : null;
};

const setToken = (token) => {
  const encryptedToken = encrypt(token);
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encryptedToken);
};

const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for security
    config.headers['X-Timestamp'] = Date.now();

    // Log API calls in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }

    return response;
  },
  async (error) => {
    const { response, config: requestConfig } = error;

    // Handle different error status codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          removeToken();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - insufficient permissions
          toast.error('You do not have permission to perform this action.');
          break;

        case 404:
          // Not found
          if (!requestConfig.silent) {
            toast.error('Requested resource not found.');
          }
          break;

        case 422:
          // Validation errors
          if (response.data?.errors) {
            const errors = Object.values(response.data.errors).flat();
            errors.forEach((error) => toast.error(error));
          } else {
            toast.error('Validation failed. Please check your input.');
          }
          break;

        case 429:
          // Rate limiting
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error('Server error occurred. Please try again later.');
          break;

        default:
          if (!requestConfig.silent) {
            toast.error(response.data?.message || 'An unexpected error occurred.');
          }
      }
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth methods
  login: (credentials) => apiClient.post('/api/Auth/login', credentials),
  logout: () => apiClient.post('/api/Auth/logout'),

  // Generic CRUD methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),

  // File upload method
  upload: (url, formData, onUploadProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
};

export { getToken, setToken, removeToken, encrypt, decrypt };
export default apiClient;
