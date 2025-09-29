import * as yup from 'yup';

export const workOrderValidationSchema = yup.object().shape({
  work_order_no: yup
    .string()
    .required('Work Order Number is required')
    .min(3, 'Work Order Number must be at least 3 characters')
    .max(50, 'Work Order Number cannot exceed 50 characters'),

  project_no: yup
    .string()
    .required('Project Number is required')
    .min(3, 'Project Number must be at least 3 characters')
    .max(100, 'Project Number cannot exceed 100 characters'),

  vendor_name: yup
    .number()
    .required('Vendor selection is required')
    .positive('Please select a valid vendor'),

  department_name: yup
    .number()
    .required('Department selection is required')
    .positive('Please select a valid department'),

  reference_tender: yup.string().max(100, 'Reference Tender cannot exceed 100 characters'),

  issue_date: yup
    .date()
    .required('Issue Date is required')
    .min(new Date().toISOString().split('T')[0], 'Issue Date cannot be in the past'),

  order_from_date: yup.date().required('Order From Date is required'),

  order_to_date: yup
    .date()
    .min(yup.ref('order_from_date'), 'Order To Date must be after Order From Date'),

  order_date: yup.date().required('Order Date is required'),

  project_amount: yup
    .string()
    .required('Project Amount is required')
    .test('is-positive', 'Amount must be greater than 0', (value) => {
      return parseFloat(value) > 0;
    }),

  remark: yup.string().max(500, 'Remarks cannot exceed 500 characters'),

  work_order_file_uploaded: yup
    .mixed()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only PDF files are allowed', (value) => {
      if (!value) return true;
      return value.type === 'application/pdf';
    }),
});
