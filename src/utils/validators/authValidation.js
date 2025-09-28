import * as yup from 'yup';

// Password strength configuration
const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  PATTERNS: {
    LOWERCASE: /(?=.*[a-z])/,
    UPPERCASE: /(?=.*[A-Z])/,
    DIGIT: /(?=.*\d)/,
    SPECIAL: /(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/~`])/,
    NO_SPACES: /^\S*$/,
    STRONG:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/~`])[A-Za-z\d@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/~`]{8,}$/,
  },
};

// Username configuration
const USERNAME_CONFIG = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 50,
  PATTERN: /^[a-zA-Z0-9._-]+$/,
  RESERVED_WORDS: ['admin', 'root', 'superuser', 'guest', 'test', 'demo', 'null', 'undefined'],
};

// Email configuration
const EMAIL_CONFIG = {
  MAX_LENGTH: 254,
  PATTERN:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  BLACKLISTED_DOMAINS: ['tempmail.com', '10minutemail.com', 'guerrillamail.com'],
};

// Custom validation methods
const customValidations = {
  isStrongPassword: (password) => {
    return PASSWORD_CONFIG.PATTERNS.STRONG.test(password);
  },

  isValidUsername: (username) => {
    return (
      USERNAME_CONFIG.PATTERN.test(username) &&
      !USERNAME_CONFIG.RESERVED_WORDS.includes(username.toLowerCase())
    );
  },

  isSecureEmail: (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return !EMAIL_CONFIG.BLACKLISTED_DOMAINS.includes(domain);
  },

  hasNoSequentialChars: (str) => {
    for (let i = 0; i < str.length - 2; i++) {
      const char1 = str.charCodeAt(i);
      const char2 = str.charCodeAt(i + 1);
      const char3 = str.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return false; // Sequential characters found
      }
    }
    return true;
  },

  hasNoRepeatingChars: (str) => {
    for (let i = 0; i < str.length - 2; i++) {
      if (str[i] === str[i + 1] && str[i + 1] === str[i + 2]) {
        return false; // Three consecutive same characters
      }
    }
    return true;
  },
};

// Enhanced Login Schema
export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(
      USERNAME_CONFIG.MIN_LENGTH,
      `Username must be at least ${USERNAME_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      USERNAME_CONFIG.MAX_LENGTH,
      `Username cannot exceed ${USERNAME_CONFIG.MAX_LENGTH} characters`
    )
    .matches(
      USERNAME_CONFIG.PATTERN,
      'Username can only contain letters, numbers, dots, hyphens, and underscores'
    )
    .test(
      'is-valid-username',
      'Username contains reserved words or invalid characters',
      customValidations.isValidUsername
    )
    .test('no-only-numbers', 'Username cannot be only numbers', (value) => !/^\d+$/.test(value)),

  password: yup
    .string()
    .required('Password is required')
    .min(
      PASSWORD_CONFIG.MIN_LENGTH,
      `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_CONFIG.MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`
    )
    .matches(PASSWORD_CONFIG.PATTERNS.NO_SPACES, 'Password cannot contain spaces'),
});

// Enhanced Registration Schema
export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(
      USERNAME_CONFIG.MIN_LENGTH,
      `Username must be at least ${USERNAME_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      USERNAME_CONFIG.MAX_LENGTH,
      `Username cannot exceed ${USERNAME_CONFIG.MAX_LENGTH} characters`
    )
    .matches(
      USERNAME_CONFIG.PATTERN,
      'Username can only contain letters, numbers, dots, hyphens, and underscores'
    )
    .test(
      'is-valid-username',
      'Username contains reserved words or invalid characters',
      customValidations.isValidUsername
    )
    .test('no-only-numbers', 'Username cannot be only numbers', (value) => !/^\d+$/.test(value)),

  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .max(EMAIL_CONFIG.MAX_LENGTH, `Email cannot exceed ${EMAIL_CONFIG.MAX_LENGTH} characters`)
    .matches(EMAIL_CONFIG.PATTERN, 'Please enter a valid email address')
    .test(
      'is-secure-email',
      'Temporary email addresses are not allowed',
      customValidations.isSecureEmail
    ),

  password: yup
    .string()
    .required('Password is required')
    .min(
      PASSWORD_CONFIG.MIN_LENGTH,
      `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_CONFIG.MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.LOWERCASE,
      'Password must contain at least one lowercase letter'
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.UPPERCASE,
      'Password must contain at least one uppercase letter'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.DIGIT, 'Password must contain at least one number')
    .matches(
      PASSWORD_CONFIG.PATTERNS.SPECIAL,
      'Password must contain at least one special character'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.NO_SPACES, 'Password cannot contain spaces')
    .test(
      'no-sequential-chars',
      'Password cannot contain sequential characters (e.g., abc, 123)',
      customValidations.hasNoSequentialChars
    )
    .test(
      'no-repeating-chars',
      'Password cannot contain repeating characters (e.g., aaa, 111)',
      customValidations.hasNoRepeatingChars
    )
    .test(
      'is-strong-password',
      'Password does not meet security requirements',
      customValidations.isStrongPassword
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['Admin', 'Manager', 'Employee', 'Vendor'], 'Please select a valid role'),

  department: yup.string().when('role', {
    is: (role) => role && role !== 'Vendor',
    then: (schema) => schema.required('Department is required for internal users'),
    otherwise: (schema) => schema.nullable(),
  }),

  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

// Enhanced Forgot Password Schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .max(EMAIL_CONFIG.MAX_LENGTH, `Email cannot exceed ${EMAIL_CONFIG.MAX_LENGTH} characters`)
    .matches(EMAIL_CONFIG.PATTERN, 'Please enter a valid email address')
    .test(
      'is-secure-email',
      'Temporary email addresses are not allowed',
      customValidations.isSecureEmail
    ),

  captcha: yup
    .string()
    .required('Please complete the security verification')
    .min(4, 'Invalid captcha response'),
});

// Enhanced Reset Password Schema
export const resetPasswordSchema = yup.object().shape({
  token: yup
    .string()
    .required('Reset token is required')
    .min(10, 'Invalid reset token format')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid reset token format'),

  password: yup
    .string()
    .required('New password is required')
    .min(
      PASSWORD_CONFIG.MIN_LENGTH,
      `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_CONFIG.MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.LOWERCASE,
      'Password must contain at least one lowercase letter'
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.UPPERCASE,
      'Password must contain at least one uppercase letter'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.DIGIT, 'Password must contain at least one number')
    .matches(
      PASSWORD_CONFIG.PATTERNS.SPECIAL,
      'Password must contain at least one special character'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.NO_SPACES, 'Password cannot contain spaces')
    .test(
      'no-sequential-chars',
      'Password cannot contain sequential characters (e.g., abc, 123)',
      customValidations.hasNoSequentialChars
    )
    .test(
      'no-repeating-chars',
      'Password cannot contain repeating characters (e.g., aaa, 111)',
      customValidations.hasNoRepeatingChars
    )
    .test(
      'is-strong-password',
      'Password does not meet security requirements',
      customValidations.isStrongPassword
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Change Password Schema (for logged-in users)
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required')
    .min(PASSWORD_CONFIG.MIN_LENGTH, 'Invalid current password format'),

  newPassword: yup
    .string()
    .required('New password is required')
    .min(
      PASSWORD_CONFIG.MIN_LENGTH,
      `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_CONFIG.MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.LOWERCASE,
      'Password must contain at least one lowercase letter'
    )
    .matches(
      PASSWORD_CONFIG.PATTERNS.UPPERCASE,
      'Password must contain at least one uppercase letter'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.DIGIT, 'Password must contain at least one number')
    .matches(
      PASSWORD_CONFIG.PATTERNS.SPECIAL,
      'Password must contain at least one special character'
    )
    .matches(PASSWORD_CONFIG.PATTERNS.NO_SPACES, 'Password cannot contain spaces')
    .test(
      'not-same-as-current',
      'New password must be different from current password',
      function (value) {
        return value !== this.parent.currentPassword;
      }
    )
    .test(
      'no-sequential-chars',
      'Password cannot contain sequential characters (e.g., abc, 123)',
      customValidations.hasNoSequentialChars
    )
    .test(
      'no-repeating-chars',
      'Password cannot contain repeating characters (e.g., aaa, 111)',
      customValidations.hasNoRepeatingChars
    )
    .test(
      'is-strong-password',
      'Password does not meet security requirements',
      customValidations.isStrongPassword
    ),

  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

// Two-Factor Authentication Setup Schema
export const twoFactorSetupSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code'),

  verificationCode: yup
    .string()
    .required('Verification code is required')
    .matches(/^\d{6}$/, 'Verification code must be 6 digits'),
});

// Two-Factor Authentication Verification Schema
export const twoFactorVerifySchema = yup.object().shape({
  username: yup.string().required('Username is required'),

  verificationCode: yup
    .string()
    .required('Verification code is required')
    .matches(/^\d{6}$/, 'Verification code must be 6 digits'),

  trustDevice: yup.boolean().default(false),
});

// Profile Update Schema
export const profileUpdateSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .max(EMAIL_CONFIG.MAX_LENGTH, `Email cannot exceed ${EMAIL_CONFIG.MAX_LENGTH} characters`)
    .matches(EMAIL_CONFIG.PATTERN, 'Please enter a valid email address')
    .test(
      'is-secure-email',
      'Temporary email addresses are not allowed',
      customValidations.isSecureEmail
    ),

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['Admin', 'Manager', 'Employee', 'Vendor'], 'Please select a valid role'),

  department: yup.string().when('role', {
    is: (role) => role && role !== 'Vendor',
    then: (schema) => schema.required('Department is required for internal users'),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Security Settings Schema
export const securitySettingsSchema = yup.object().shape({
  enableTwoFactor: yup.boolean().default(false),

  loginNotifications: yup.boolean().default(true),

  sessionTimeout: yup
    .number()
    .required('Session timeout is required')
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(480, 'Session timeout cannot exceed 8 hours')
    .default(60),

  allowedIpAddresses: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:3[0-2]|[12]?[0-9]))?$/,
          'Invalid IP address format'
        )
    )
    .nullable(),
});

// Password strength checker utility
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: [] };

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  // Character variety checks
  if (PASSWORD_CONFIG.PATTERNS.LOWERCASE.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (PASSWORD_CONFIG.PATTERNS.UPPERCASE.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (PASSWORD_CONFIG.PATTERNS.DIGIT.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (PASSWORD_CONFIG.PATTERNS.SPECIAL.test(password)) score += 1;
  else feedback.push('Add special characters');

  // Additional security checks
  if (customValidations.hasNoSequentialChars(password)) score += 1;
  else feedback.push('Avoid sequential characters');

  if (customValidations.hasNoRepeatingChars(password)) score += 1;
  else feedback.push('Avoid repeating characters');

  // Length bonus
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  return {
    score: Math.min(score, 8),
    strength: score < 3 ? 'weak' : score < 6 ? 'medium' : 'strong',
    feedback: feedback,
  };
};

// Rate limiting schema for login attempts
export const rateLimitSchema = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDuration: 30 * 60 * 1000, // 30 minutes
  skipSuccessfulRequests: true,
};

// Export validation configurations for use in components
export const validationConfig = {
  PASSWORD_CONFIG,
  USERNAME_CONFIG,
  EMAIL_CONFIG,
  customValidations,
};

// Common validation messages
export const validationMessages = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_USERNAME: 'Username contains invalid characters',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_TOKEN: 'Invalid or expired token',
  ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts',
};

export default {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  twoFactorSetupSchema,
  twoFactorVerifySchema,
  profileUpdateSchema,
  securitySettingsSchema,
  getPasswordStrength,
  rateLimitSchema,
  validationConfig,
  validationMessages,
};
