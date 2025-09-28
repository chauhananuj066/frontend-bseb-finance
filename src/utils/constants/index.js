export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/Auth/login',
    LOGOUT: '/api/Auth/logout',
    CAPTCHA: '/api/Auth/captcha',
  },
  INVOICES: {
    LIST: '/api/Invoice',
    GET: (id) => `/api/Invoice/${id}`,
    CREATE: '/api/Invoice/submit',
    UPDATE: '/api/Invoice/update',
    DELETE: '/api/Invoice/delete',
    STATUS: '/api/Invoice/status',
    BY_VENDOR: (vendorId) => `/api/Invoice/byvendor/${vendorId}`,
    BY_DEPARTMENT: (departmentId, status) => `/api/Invoice/bydepartment/${departmentId}/${status}`,
    BY_STATUS: (status) => `/api/Invoice/bystatus/${status}`,
  },
  PAYMENTS: {
    LIST: '/api/Payments',
    GET: (id) => `/api/Payments/${id}`,
    CREATE: '/api/Payments/create',
    UPDATE: '/api/Payments/update',
    DELETE: '/api/Payments/delete',
    BY_INVOICE: (invoiceId) => `/api/Payments/invoice/${invoiceId}`,
  },
  WORK_ORDERS: {
    LIST: '/api/WorkOrders',
    GET: (id) => `/api/WorkOrders/${id}`,
    CREATE: '/api/WorkOrders/create',
    UPDATE: '/api/WorkOrders/update',
    DELETE: (id) => `/api/WorkOrders/delete/${id}`,
  },
  USERS: {
    LIST: '/api/User',
    GET: (id) => `/api/User/${id}`,
    CREATE: '/api/User/create',
    UPDATE: (id) => `/api/User/update/${id}`,
    DELETE: (id) => `/api/User/delete/${id}`,
    DEPARTMENTS: '/api/User/departments',
  },
};

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 0,
  SUBMITTED: 1,
  APPROVED: 2,
  PAID: 5,
  REJECTED: 9,
  DELETED: -1,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  CLERK: 'clerk',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bseb_auth_token',
  USER_DATA: 'bseb_user_data',
  THEME: 'bseb_theme',
};
