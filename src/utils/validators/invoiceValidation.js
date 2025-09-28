import * as yup from 'yup';

export const invoiceSchema = yup.object().shape({
  work_order_no: yup
    .number()
    .required('Work Order Number is required')
    .positive('Work Order Number must be positive')
    .integer('Work Order Number must be an integer'),

  vendor_name: yup.number().required('Vendor is required').positive('Please select a valid vendor'),

  gstin: yup
    .string()
    .required('GSTIN is required')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Please enter a valid GSTIN'
    ),

  department_name: yup
    .number()
    .required('Department is required')
    .positive('Please select a valid department'),

  invoice_no: yup
    .string()
    .required('Invoice Number is required')
    .min(3, 'Invoice Number must be at least 3 characters')
    .max(50, 'Invoice Number must not exceed 50 characters'),

  invoice_date: yup
    .date()
    .required('Invoice Date is required')
    .max(new Date(), 'Invoice Date cannot be in the future'),

  due_date: yup
    .date()
    .required('Due Date is required')
    .min(yup.ref('invoice_date'), 'Due Date must be after Invoice Date'),

  basic_amt: yup
    .string()
    .required('Basic Amount is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount')
    .test('positive', 'Amount must be positive', (value) => parseFloat(value || 0) > 0),

  tds_rate: yup
    .string()
    .required('TDS Rate is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid TDS rate')
    .test('range', 'TDS Rate must be between 0 and 100', (value) => {
      const rate = parseFloat(value || 0);
      return rate >= 0 && rate <= 100;
    }),

  remark: yup.string().max(500, 'Remark must not exceed 500 characters'),

  file_uploaded: yup
    .mixed()
    .test('fileSize', 'File size must be less than 10MB', (value) => {
      if (!value) return true; // Optional file
      return value.size <= 10485760; // 10MB
    })
    .test('fileType', 'Only PDF, DOC, DOCX, JPG, PNG files are allowed', (value) => {
      if (!value) return true; // Optional file
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];
      return allowedTypes.includes(value.type);
    }),
});

// Status update schema
export const invoiceStatusUpdateSchema = yup.object().shape({
  status: yup
    .number()
    .required('Status is required')
    .oneOf([0, 1, 2, 5, 9, -1], 'Please select a valid status'),

  remark: yup.string().when('status', {
    is: (status) => status === 9 || status === -1, // Rejected or Deleted
    then: (schema) => schema.required('Remark is required for rejection/deletion'),
    otherwise: (schema) => schema.max(500, 'Remark must not exceed 500 characters'),
  }),
});

// Return invoice schema
export const returnInvoiceSchema = yup.object().shape({
  remark: yup
    .string()
    .required('Please provide a reason for returning the invoice')
    .min(10, 'Please provide a detailed reason (at least 10 characters)')
    .max(500, 'Remark must not exceed 500 characters'),
});

// Invoice filter schema
export const invoiceFilterSchema = yup.object().shape({
  status: yup.number().nullable(),
  vendor_id: yup.number().nullable(),
  department_id: yup.number().nullable(),
  date_from: yup.date().nullable(),
  date_to: yup
    .date()
    .nullable()
    .when('date_from', {
      is: (date_from) => date_from,
      then: (schema) => schema.min(yup.ref('date_from'), 'End date must be after start date'),
      otherwise: (schema) => schema.nullable(),
    }),
  amount_min: yup.number().nullable().min(0, 'Minimum amount must be positive'),
  amount_max: yup
    .number()
    .nullable()
    .when('amount_min', {
      is: (amount_min) => amount_min,
      then: (schema) =>
        schema.min(yup.ref('amount_min'), 'Maximum amount must be greater than minimum'),
      otherwise: (schema) => schema.nullable(),
    }),
});
