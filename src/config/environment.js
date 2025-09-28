const validateEnvVar = (value, type = 'string', required = false, defaultValue = null) => {
  if (!value && required) {
    throw new Error(`Required environment variable is missing`);
  }

  if (!value) return defaultValue;

  switch (type) {
    case 'number': {
      const num = parseInt(value);
      return isNaN(num) ? defaultValue : num;
    }
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'array':
      return value.split(',').map((item) => item.trim());
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    default:
      return value;
  }
};

/**
 * Environment detection
 */
const getEnvironment = () => {
  const env = import.meta.env.MODE || import.meta.env.NODE_ENV || 'development';

  return {
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isStaging: env === 'staging',
    isTesting: env === 'test',
    current: env,
  };
};

const environment = getEnvironment();

/**
 * Application Configuration
 */
const appConfig = {
  name: validateEnvVar(import.meta.env.VITE_APP_NAME, 'string', false, 'BSEB Finance System'),
  displayName: validateEnvVar(
    import.meta.env.VITE_APP_DISPLAY_NAME,
    'string',
    false,
    'Bihar State Electricity Board - Finance Management'
  ),
  shortName: validateEnvVar(import.meta.env.VITE_APP_SHORT_NAME, 'string', false, 'BSEB'),
  version: validateEnvVar(import.meta.env.VITE_APP_VERSION, 'string', false, '1.0.0'),
  buildNumber: validateEnvVar(import.meta.env.VITE_BUILD_NUMBER, 'string', false, '1'),
  buildDate: validateEnvVar(
    import.meta.env.VITE_BUILD_DATE,
    'string',
    false,
    new Date().toISOString()
  ),
  description: validateEnvVar(
    import.meta.env.VITE_APP_DESCRIPTION,
    'string',
    false,
    'Comprehensive finance management system for BSEB operations'
  ),
  author: validateEnvVar(import.meta.env.VITE_APP_AUTHOR, 'string', false, 'BSEB IT Team'),
  license: validateEnvVar(import.meta.env.VITE_APP_LICENSE, 'string', false, 'Proprietary'),

  // App-specific settings
  theme: {
    default: validateEnvVar(import.meta.env.VITE_DEFAULT_THEME, 'string', false, 'light'),
    allowUserSelection: validateEnvVar(
      import.meta.env.VITE_ALLOW_THEME_SELECTION,
      'boolean',
      false,
      true
    ),
    primaryColor: validateEnvVar(import.meta.env.VITE_PRIMARY_COLOR, 'string', false, '#1976d2'),
    secondaryColor: validateEnvVar(
      import.meta.env.VITE_SECONDARY_COLOR,
      'string',
      false,
      '#dc004e'
    ),
  },

  // Language & Localization
  i18n: {
    defaultLanguage: validateEnvVar(import.meta.env.VITE_DEFAULT_LANGUAGE, 'string', false, 'en'),
    supportedLanguages: validateEnvVar(import.meta.env.VITE_SUPPORTED_LANGUAGES, 'array', false, [
      'en',
      'hi',
    ]),
    fallbackLanguage: validateEnvVar(import.meta.env.VITE_FALLBACK_LANGUAGE, 'string', false, 'en'),
    enableRTL: validateEnvVar(import.meta.env.VITE_ENABLE_RTL, 'boolean', false, false),
  },

  // PWA Configuration
  pwa: {
    enabled: validateEnvVar(import.meta.env.VITE_PWA_ENABLED, 'boolean', false, true),
    updateInterval: validateEnvVar(
      import.meta.env.VITE_PWA_UPDATE_INTERVAL,
      'number',
      false,
      60000
    ),
    cacheFirst: validateEnvVar(import.meta.env.VITE_PWA_CACHE_FIRST, 'boolean', false, true),
  },
};

/**
 * API Configuration
 */
const apiConfig = {
  // Base URLs
  baseUrl: validateEnvVar(
    import.meta.env.VITE_API_BASE_URL,
    'string',
    true,
    'http://localhost:5000'
  ),
  version: validateEnvVar(import.meta.env.VITE_API_VERSION, 'string', false, 'v1'),
  prefix: validateEnvVar(import.meta.env.VITE_API_PREFIX, 'string', false, 'api'),

  // Timeout configurations
  timeout: validateEnvVar(import.meta.env.VITE_API_TIMEOUT, 'number', false, 30000),
  retryDelay: validateEnvVar(import.meta.env.VITE_API_RETRY_DELAY, 'number', false, 1000),
  maxRetries: validateEnvVar(import.meta.env.VITE_API_MAX_RETRIES, 'number', false, 3),

  // Request configurations
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': appConfig.version,
    'X-Client-Platform': 'web',
  },

  // Authentication endpoints
  endpoints: {
    auth: {
      login: '/api/Auth/login',
      logout: '/api/Auth/logout',
      refresh: '/api/Auth/refresh',
      verify: '/api/Auth/verify',
      forgotPassword: '/api/Auth/forgot-password',
      resetPassword: '/api/Auth/reset-password',
    },
    users: {
      base: '/api/User',
      departments: '/api/User/departments',
    },
    invoices: {
      base: '/api/Invoice',
      byVendor: '/api/Invoice/byvendor',
      byDepartment: '/api/Invoice/bydepartment',
      byStatus: '/api/Invoice/bystatus',
    },
    payments: {
      base: '/api/Payments',
      byInvoice: '/api/Payments/invoice',
    },
    workOrders: {
      base: '/api/WorkOrders',
    },
  },

  // Rate limiting
  rateLimit: {
    enabled: validateEnvVar(import.meta.env.VITE_API_RATE_LIMIT_ENABLED, 'boolean', false, true),
    maxRequests: validateEnvVar(import.meta.env.VITE_API_RATE_LIMIT_MAX, 'number', false, 100),
    windowMs: validateEnvVar(import.meta.env.VITE_API_RATE_LIMIT_WINDOW, 'number', false, 900000), // 15 minutes
    skipSuccessfulRequests: validateEnvVar(
      import.meta.env.VITE_API_RATE_LIMIT_SKIP_SUCCESS,
      'boolean',
      false,
      true
    ),
  },

  // Caching
  cache: {
    enabled: validateEnvVar(
      import.meta.env.VITE_API_CACHE_ENABLED,
      'boolean',
      false,
      !environment.isDevelopment
    ),
    ttl: validateEnvVar(import.meta.env.VITE_API_CACHE_TTL, 'number', false, 300000), // 5 minutes
    maxSize: validateEnvVar(import.meta.env.VITE_API_CACHE_MAX_SIZE, 'number', false, 50),
  },
};

/**
 * Security Configuration
 */
const securityConfig = {
  // Encryption
  encryptionKey: validateEnvVar(
    import.meta.env.VITE_ENCRYPTION_KEY,
    'string',
    !environment.isDevelopment
  ),
  encryptionAlgorithm: validateEnvVar(
    import.meta.env.VITE_ENCRYPTION_ALGORITHM,
    'string',
    false,
    'AES-GCM'
  ),

  // Session management
  session: {
    timeout: validateEnvVar(import.meta.env.VITE_SESSION_TIMEOUT, 'number', false, 1800000), // 30 minutes
    warningTime: validateEnvVar(import.meta.env.VITE_SESSION_WARNING_TIME, 'number', false, 300000), // 5 minutes before timeout
    extendOnActivity: validateEnvVar(
      import.meta.env.VITE_SESSION_EXTEND_ON_ACTIVITY,
      'boolean',
      false,
      true
    ),
    maxConcurrentSessions: validateEnvVar(
      import.meta.env.VITE_MAX_CONCURRENT_SESSIONS,
      'number',
      false,
      3
    ),
  },

  // Authentication
  auth: {
    tokenKey: validateEnvVar(
      import.meta.env.VITE_AUTH_TOKEN_KEY,
      'string',
      false,
      'bseb_auth_token'
    ),
    refreshTokenKey: validateEnvVar(
      import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY,
      'string',
      false,
      'bseb_refresh_token'
    ),
    userDataKey: validateEnvVar(
      import.meta.env.VITE_USER_DATA_KEY,
      'string',
      false,
      'bseb_user_data'
    ),
    rememberMeKey: validateEnvVar(
      import.meta.env.VITE_REMEMBER_ME_KEY,
      'string',
      false,
      'bseb_remember_me'
    ),
    tokenExpiry: validateEnvVar(import.meta.env.VITE_TOKEN_EXPIRY, 'number', false, 3600), // 1 hour
    refreshTokenExpiry: validateEnvVar(
      import.meta.env.VITE_REFRESH_TOKEN_EXPIRY,
      'number',
      false,
      604800
    ), // 7 days
    enableTwoFactor: validateEnvVar(import.meta.env.VITE_ENABLE_2FA, 'boolean', false, false),
    maxLoginAttempts: validateEnvVar(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS, 'number', false, 5),
    lockoutDuration: validateEnvVar(import.meta.env.VITE_LOCKOUT_DURATION, 'number', false, 900000), // 15 minutes
  },

  // Password policy
  password: {
    minLength: validateEnvVar(import.meta.env.VITE_PASSWORD_MIN_LENGTH, 'number', false, 8),
    maxLength: validateEnvVar(import.meta.env.VITE_PASSWORD_MAX_LENGTH, 'number', false, 128),
    requireUppercase: validateEnvVar(
      import.meta.env.VITE_PASSWORD_REQUIRE_UPPERCASE,
      'boolean',
      false,
      true
    ),
    requireLowercase: validateEnvVar(
      import.meta.env.VITE_PASSWORD_REQUIRE_LOWERCASE,
      'boolean',
      false,
      true
    ),
    requireNumbers: validateEnvVar(
      import.meta.env.VITE_PASSWORD_REQUIRE_NUMBERS,
      'boolean',
      false,
      true
    ),
    requireSpecialChars: validateEnvVar(
      import.meta.env.VITE_PASSWORD_REQUIRE_SPECIAL,
      'boolean',
      false,
      true
    ),
    preventCommonPasswords: validateEnvVar(
      import.meta.env.VITE_PASSWORD_PREVENT_COMMON,
      'boolean',
      false,
      true
    ),
    historyCount: validateEnvVar(import.meta.env.VITE_PASSWORD_HISTORY_COUNT, 'number', false, 5),
    expiryDays: validateEnvVar(import.meta.env.VITE_PASSWORD_EXPIRY_DAYS, 'number', false, 90),
  },

  // Content Security Policy
  csp: {
    enabled: validateEnvVar(
      import.meta.env.VITE_CSP_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
    reportOnly: validateEnvVar(
      import.meta.env.VITE_CSP_REPORT_ONLY,
      'boolean',
      false,
      !environment.isProduction
    ),
    reportUri: validateEnvVar(
      import.meta.env.VITE_CSP_REPORT_URI,
      'string',
      false,
      '/api/csp-report'
    ),
  },

  // HTTPS settings
  https: {
    enabled: validateEnvVar(
      import.meta.env.VITE_HTTPS_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
    enforceSSL: validateEnvVar(
      import.meta.env.VITE_ENFORCE_SSL,
      'boolean',
      false,
      environment.isProduction
    ),
    hsts: {
      enabled: validateEnvVar(
        import.meta.env.VITE_HSTS_ENABLED,
        'boolean',
        false,
        environment.isProduction
      ),
      maxAge: validateEnvVar(import.meta.env.VITE_HSTS_MAX_AGE, 'number', false, 31536000),
      includeSubDomains: validateEnvVar(
        import.meta.env.VITE_HSTS_INCLUDE_SUBDOMAINS,
        'boolean',
        false,
        true
      ),
    },
  },
};

/**
 * Feature Flags Configuration
 */
const featureConfig = {
  // Development tools
  devTools: {
    reduxDevTools: validateEnvVar(
      import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS,
      'boolean',
      false,
      environment.isDevelopment
    ),
    reactDevTools: validateEnvVar(
      import.meta.env.VITE_ENABLE_REACT_DEVTOOLS,
      'boolean',
      false,
      environment.isDevelopment
    ),
    performanceMonitoring: validateEnvVar(
      import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING,
      'boolean',
      false,
      true
    ),
    errorBoundary: validateEnvVar(
      import.meta.env.VITE_ENABLE_ERROR_BOUNDARY,
      'boolean',
      false,
      true
    ),
    hotReload: validateEnvVar(
      import.meta.env.VITE_ENABLE_HOT_RELOAD,
      'boolean',
      false,
      environment.isDevelopment
    ),
  },

  // Application features
  features: {
    // Core features
    invoiceManagement: validateEnvVar(
      import.meta.env.VITE_FEATURE_INVOICE_MANAGEMENT,
      'boolean',
      false,
      true
    ),
    paymentProcessing: validateEnvVar(
      import.meta.env.VITE_FEATURE_PAYMENT_PROCESSING,
      'boolean',
      false,
      true
    ),
    workOrderManagement: validateEnvVar(
      import.meta.env.VITE_FEATURE_WORK_ORDER_MANAGEMENT,
      'boolean',
      false,
      true
    ),
    userManagement: validateEnvVar(
      import.meta.env.VITE_FEATURE_USER_MANAGEMENT,
      'boolean',
      false,
      true
    ),

    // Advanced features
    auditLog: validateEnvVar(import.meta.env.VITE_FEATURE_AUDIT_LOG, 'boolean', false, true),
    reporting: validateEnvVar(import.meta.env.VITE_FEATURE_REPORTING, 'boolean', false, true),
    dashboardAnalytics: validateEnvVar(
      import.meta.env.VITE_FEATURE_DASHBOARD_ANALYTICS,
      'boolean',
      false,
      true
    ),
    exportData: validateEnvVar(import.meta.env.VITE_FEATURE_EXPORT_DATA, 'boolean', false, true),
    bulkOperations: validateEnvVar(
      import.meta.env.VITE_FEATURE_BULK_OPERATIONS,
      'boolean',
      false,
      true
    ),

    // Integration features
    emailNotifications: validateEnvVar(
      import.meta.env.VITE_FEATURE_EMAIL_NOTIFICATIONS,
      'boolean',
      false,
      true
    ),
    smsNotifications: validateEnvVar(
      import.meta.env.VITE_FEATURE_SMS_NOTIFICATIONS,
      'boolean',
      false,
      false
    ),
    webhooks: validateEnvVar(import.meta.env.VITE_FEATURE_WEBHOOKS, 'boolean', false, false),
    apiAccess: validateEnvVar(import.meta.env.VITE_FEATURE_API_ACCESS, 'boolean', false, true),

    // UI features
    darkMode: validateEnvVar(import.meta.env.VITE_FEATURE_DARK_MODE, 'boolean', false, true),
    responsiveDesign: validateEnvVar(
      import.meta.env.VITE_FEATURE_RESPONSIVE_DESIGN,
      'boolean',
      false,
      true
    ),
    accessibility: validateEnvVar(
      import.meta.env.VITE_FEATURE_ACCESSIBILITY,
      'boolean',
      false,
      true
    ),
    animations: validateEnvVar(import.meta.env.VITE_FEATURE_ANIMATIONS, 'boolean', false, true),

    // Beta features
    betaFeatures: validateEnvVar(
      import.meta.env.VITE_ENABLE_BETA_FEATURES,
      'boolean',
      false,
      environment.isDevelopment
    ),
    experimentalFeatures: validateEnvVar(
      import.meta.env.VITE_ENABLE_EXPERIMENTAL_FEATURES,
      'boolean',
      false,
      false
    ),
  },
};

/**
 * File Upload Configuration
 */
const uploadConfig = {
  // Size limits
  maxSize: validateEnvVar(import.meta.env.VITE_FILE_UPLOAD_MAX_SIZE, 'number', false, 10485760), // 10MB
  maxFiles: validateEnvVar(import.meta.env.VITE_FILE_UPLOAD_MAX_FILES, 'number', false, 10),
  chunkSize: validateEnvVar(import.meta.env.VITE_FILE_UPLOAD_CHUNK_SIZE, 'number', false, 1048576), // 1MB

  // Allowed file types
  allowedTypes: validateEnvVar(import.meta.env.VITE_FILE_UPLOAD_ALLOWED_TYPES, 'array', false, [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text files
    'text/plain',
    'text/csv',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
  ]),

  // Upload endpoints
  endpoints: {
    single: validateEnvVar(
      import.meta.env.VITE_UPLOAD_SINGLE_ENDPOINT,
      'string',
      false,
      '/api/upload/single'
    ),
    multiple: validateEnvVar(
      import.meta.env.VITE_UPLOAD_MULTIPLE_ENDPOINT,
      'string',
      false,
      '/api/upload/multiple'
    ),
    chunk: validateEnvVar(
      import.meta.env.VITE_UPLOAD_CHUNK_ENDPOINT,
      'string',
      false,
      '/api/upload/chunk'
    ),
  },

  // Security
  virusScan: validateEnvVar(
    import.meta.env.VITE_UPLOAD_VIRUS_SCAN,
    'boolean',
    false,
    environment.isProduction
  ),
  validateMimeType: validateEnvVar(
    import.meta.env.VITE_UPLOAD_VALIDATE_MIME_TYPE,
    'boolean',
    false,
    true
  ),
  sanitizeFilenames: validateEnvVar(
    import.meta.env.VITE_UPLOAD_SANITIZE_FILENAMES,
    'boolean',
    false,
    true
  ),
};

/**
 * Logging Configuration
 */
const loggingConfig = {
  enabled: validateEnvVar(import.meta.env.VITE_LOGGING_ENABLED, 'boolean', false, true),
  level: validateEnvVar(
    import.meta.env.VITE_LOGGING_LEVEL,
    'string',
    false,
    environment.isDevelopment ? 'debug' : 'warn'
  ),

  // Console logging
  console: {
    enabled: validateEnvVar(
      import.meta.env.VITE_CONSOLE_LOGGING_ENABLED,
      'boolean',
      false,
      environment.isDevelopment
    ),
    colorize: validateEnvVar(import.meta.env.VITE_CONSOLE_LOGGING_COLORIZE, 'boolean', false, true),
  },

  // Remote logging
  remote: {
    enabled: validateEnvVar(
      import.meta.env.VITE_REMOTE_LOGGING_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
    endpoint: validateEnvVar(
      import.meta.env.VITE_REMOTE_LOGGING_ENDPOINT,
      'string',
      false,
      '/api/logs'
    ),
    batchSize: validateEnvVar(import.meta.env.VITE_REMOTE_LOGGING_BATCH_SIZE, 'number', false, 10),
    flushInterval: validateEnvVar(
      import.meta.env.VITE_REMOTE_LOGGING_FLUSH_INTERVAL,
      'number',
      false,
      30000
    ),
  },

  // Error reporting
  errorReporting: {
    enabled: validateEnvVar(
      import.meta.env.VITE_ERROR_REPORTING_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
    dsn: validateEnvVar(import.meta.env.VITE_ERROR_REPORTING_DSN, 'string', false),
    sampleRate: validateEnvVar(
      import.meta.env.VITE_ERROR_REPORTING_SAMPLE_RATE,
      'number',
      false,
      1.0
    ),
  },
};

/**
 * Performance Configuration
 */
const performanceConfig = {
  // Caching
  cache: {
    enabled: validateEnvVar(import.meta.env.VITE_CACHE_ENABLED, 'boolean', false, true),
    strategy: validateEnvVar(
      import.meta.env.VITE_CACHE_STRATEGY,
      'string',
      false,
      'stale-while-revalidate'
    ),
    maxAge: validateEnvVar(import.meta.env.VITE_CACHE_MAX_AGE, 'number', false, 300000), // 5 minutes
    maxSize: validateEnvVar(import.meta.env.VITE_CACHE_MAX_SIZE, 'number', false, 100),
  },

  // Lazy loading
  lazyLoading: {
    enabled: validateEnvVar(import.meta.env.VITE_LAZY_LOADING_ENABLED, 'boolean', false, true),
    threshold: validateEnvVar(
      import.meta.env.VITE_LAZY_LOADING_THRESHOLD,
      'string',
      false,
      '100px'
    ),
    placeholderType: validateEnvVar(
      import.meta.env.VITE_LAZY_LOADING_PLACEHOLDER,
      'string',
      false,
      'skeleton'
    ),
  },

  // Bundle optimization
  bundleOptimization: {
    codesplitting: validateEnvVar(
      import.meta.env.VITE_CODE_SPLITTING_ENABLED,
      'boolean',
      false,
      true
    ),
    treeShaking: validateEnvVar(import.meta.env.VITE_TREE_SHAKING_ENABLED, 'boolean', false, true),
    compression: validateEnvVar(
      import.meta.env.VITE_COMPRESSION_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
  },
};

/**
 * Third-party Service Configuration
 */
const servicesConfig = {
  // Analytics
  analytics: {
    enabled: validateEnvVar(
      import.meta.env.VITE_ANALYTICS_ENABLED,
      'boolean',
      false,
      environment.isProduction
    ),
    googleAnalyticsId: validateEnvVar(import.meta.env.VITE_GOOGLE_ANALYTICS_ID, 'string', false),
    hotjarId: validateEnvVar(import.meta.env.VITE_HOTJAR_ID, 'string', false),
  },

  // Maps
  maps: {
    enabled: validateEnvVar(import.meta.env.VITE_MAPS_ENABLED, 'boolean', false, false),
    provider: validateEnvVar(import.meta.env.VITE_MAPS_PROVIDER, 'string', false, 'google'),
    apiKey: validateEnvVar(import.meta.env.VITE_MAPS_API_KEY, 'string', false),
  },

  // Payment gateways
  payments: {
    razorpay: {
      enabled: validateEnvVar(import.meta.env.VITE_RAZORPAY_ENABLED, 'boolean', false, false),
      keyId: validateEnvVar(import.meta.env.VITE_RAZORPAY_KEY_ID, 'string', false),
      currency: validateEnvVar(import.meta.env.VITE_RAZORPAY_CURRENCY, 'string', false, 'INR'),
    },
  },
};

/**
 * Main Configuration Export
 */
export const config = {
  // Environment information
  environment,

  // Core configurations
  app: appConfig,
  api: apiConfig,
  security: securityConfig,
  features: featureConfig,
  upload: uploadConfig,
  logging: loggingConfig,
  performance: performanceConfig,
  services: servicesConfig,

  // Utility functions
  utils: {
    validateEnvVar,
    getEnvironment,

    // Helper to check if feature is enabled
    isFeatureEnabled: (feature) => {
      const keys = feature.split('.');
      let current = featureConfig.features;

      for (const key of keys) {
        if (current[key] === undefined) return false;
        current = current[key];
      }

      return Boolean(current);
    },

    // Helper to get API endpoint URL
    getApiUrl: (endpoint) => {
      const baseUrl = apiConfig.baseUrl.endsWith('/')
        ? apiConfig.baseUrl.slice(0, -1)
        : apiConfig.baseUrl;

      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      return `${baseUrl}${cleanEndpoint}`;
    },

    // Helper to check environment
    isProduction: () => environment.isProduction,
    isDevelopment: () => environment.isDevelopment,
    isStaging: () => environment.isStaging,
    isTesting: () => environment.isTesting,
  },
};

// Validate critical configurations in production
if (environment.isProduction) {
  const criticalVars = [
    { key: 'API_BASE_URL', value: config.api.baseUrl },
    { key: 'ENCRYPTION_KEY', value: config.security.encryptionKey },
  ];

  criticalVars.forEach(({ key, value }) => {
    if (!value) {
      console.error(`Critical environment variable ${key} is not set in production`);
    }
  });
}

// Export individual configs for convenience
export const { app, api, security, features, upload, logging, performance, services, utils } =
  config;

// Export environment helpers
export const { isDevelopment, isProduction, isStaging, isTesting } = environment;

// Freeze configuration in production to prevent mutations
if (environment.isProduction) {
  Object.freeze(config);
}

export default config;

// export const config = {
//   app: {
//     name: import.meta.env.VITE_APP_NAME || 'BSEB Finance',
//     version: import.meta.env.VITE_APP_VERSION || '1.0.0',
//   },
//   api: {
//     baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
//     timeout: 30000,
//   },
//   security: {
//     encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY,
//     sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000,
//   },
//   features: {
//     enableReduxDevtools: import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS === 'true',
//   },
//   upload: {
//     maxSize: parseInt(import.meta.env.VITE_FILE_UPLOAD_MAX_SIZE) || 10485760,
//     allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'],
//   },
// };

// Environment Configuration for BSEB Finance System
// Premium, Professional, Modern & Secure Configuration

/**
 * Validates environment variables and provides fallbacks
 */
