import * as yup from 'yup';

export const userSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .matches(
      /^[a-zA-Z0-9_.-]+$/,
      'Username can only contain letters, numbers, dots, hyphens and underscores'
    ),

  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .max(255, 'Email must not exceed 255 characters'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .when('isEdit', {
      is: false,
      then: (schema) => schema.required('Password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  confirmPassword: yup.string().when('password', {
    is: (val) => val && val.length > 0,
    then: (schema) =>
      schema
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    otherwise: (schema) => schema.notRequired(),
  }),

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['admin', 'manager', 'accountant', 'clerk'], 'Please select a valid role'),

  department: yup
    .string()
    .required('Department is required')
    .max(100, 'Department name must not exceed 100 characters'),
});

export const departmentSchema = yup.object().shape({
  department_name: yup
    .string()
    .required('Department name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must not exceed 100 characters'),

  created_by: yup.string().required('Created by is required'),
});

// Password change schema
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),

  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),

  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});
