import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useVendors } from '../../../../hooks/api/useVendors';
import { useDepartments } from '../../../../hooks/api/useDepartments';
import { useWorkOrders } from '../../../../hooks/api/useWorkOrders';
// import { useVendors , useDepartments,useWorkOrders } from '@/services/api/client';

// Validation
import { workOrderValidationSchema } from '../../../../utils/validators/workOrderValidation';

// Components
import FormAlerts from '../../workorders/create/components/FormAlerts';
import ProjectInfoSection from '../create/sections/ProjectInfoSection';
import VendorInfoSection from '../create/sections/VendorInfoSection';
import DepartmentInfoSection from '../create/sections/DepartmentInfoSection';
import DateInfoSection from '../create/sections/DateInfoSection';
import FinancialInfoSection from '../create/sections/FinancialInfoSection';
import FileUploadSection from '../create/sections/FileUploadSection';
import RemarksSection from '../create/sections/RemarksSection';
import ActionButtons from '../../workorders/create/components/ActionButtons';

const WorkOrderForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Hooks
  const { vendors, loading: vendorsLoading } = useVendors();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { createWorkOrder, loading: submitting } = useWorkOrders();

  // Local state
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    resolver: yupResolver(workOrderValidationSchema),
    mode: 'onChange',
    defaultValues: {
      work_order_no: '',
      project_no: '',
      vendor_name: null,
      department_name: null,
      reference_tender: '',
      issue_date: today,
      order_from_date: today,
      order_to_date: '',
      order_date: today,
      project_amount: '',
      work_order_file_uploaded: null,
      work_order_file_name: '',
      remark: '',
    },
  });

  const watchedValues = watch();

  // Form submission
  const onSubmit = async (data) => {
    setError('');
    setSuccess('');

    try {
      // Create FormData for multipart/form-data
      const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
        // output: "2025-09-29"
      };

      const formData = new FormData();

      // Append all fields
      formData.append('work_order_no', data.work_order_no);
      formData.append('project_no', data.project_no);
      //formData.append('vendor_name', data.vendor_name); // Integer ID
      formData.append('vendor_name', data.vendor_name); // Integer (1,2,3.. for backend validation)
      +formData.append('vendor_code', selectedVendor?.No_ || ''); // <-- original "V000001"

      formData.append('department_name', data.department_name); // Integer ID
      formData.append('reference_tender', data.reference_tender || '');
      // formData.append('issue_date', data.issue_date);
      // formData.append('order_from_date', data.order_from_date);
      // formData.append('order_to_date', data.order_to_date || '');
      // formData.append('order_date', data.order_date);
      formData.append('issue_date', formatDate(data.issue_date));
      formData.append('order_from_date', formatDate(data.order_from_date));
      formData.append('order_to_date', formatDate(data.order_to_date));
      formData.append('order_date', formatDate(data.order_date));
      formData.append('project_amount', data.project_amount);
      formData.append('remark', data.remark || '');
      formData.append('created_by', 'system'); // Replace with actual user

      // Append file if exists
      if (data.work_order_file_uploaded) {
        formData.append('work_order_file_uploaded', data.work_order_file_uploaded);
        formData.append('work_order_file_name', data.work_order_file_uploaded.name);
      } else {
        formData.append('work_order_file_name', '');
      }

      // Submit to API
      const result = await createWorkOrder(formData);

      setSuccess(`Work Order #${data.work_order_no} created successfully!`);

      // Reset form
      reset();
      setSelectedVendor(null);
      setSelectedDepartment(null);

      // Redirect to list after 2 seconds
      setTimeout(() => {
        navigate('/work-orders');
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to create work order. Please try again.');
    }
  };

  // const onSubmit = async (data) => {
  //   setError('');
  //   setSuccess('');

  //   // helper fn for formatting dates
  //   const formatDate = (date) =>
  //     date ? new Date(date).toISOString().split('T')[0] : '';

  //   try {
  //     // ------------------
  //     // Build formData
  //     // ------------------
  //     const formData = new FormData();
  //     formData.append('work_order_no', data.work_order_no);
  //     formData.append('project_no', data.project_no);
  //     formData.append('vendor_name', data.vendor_name); // int (backend field)
  //     formData.append('vendor_code', selectedVendor?.No_ || ''); // string (V000001)
  //     formData.append('department_name', data.department_name);
  //     formData.append('reference_tender', data.reference_tender || '');
  //     formData.append('issue_date', formatDate(data.issue_date));
  //     formData.append('order_from_date', formatDate(data.order_from_date));
  //     formData.append('order_to_date', formatDate(data.order_to_date));
  //     formData.append('order_date', formatDate(data.order_date));
  //     formData.append('project_amount', data.project_amount);
  //     formData.append('remark', data.remark || '');
  //     formData.append('created_by', 'system'); // TODO: replace with logged-in user
  //     formData.append('status', '1'); // default active

  //     // file handling
  //     if (data.work_order_file_uploaded) {
  //       formData.append('work_order_file_uploaded', data.work_order_file_uploaded);
  //       formData.append('work_order_file_name', data.work_order_file_uploaded.name);
  //     } else {
  //       formData.append('work_order_file_name', '');
  //     }

  //     // VendorsJson -> stringified array
  //    if (selectedVendor) {
  //   const vendorPayload = [
  //     {
  //       vendor_name: data.vendor_name || '',
  //       vendor_code: selectedVendor?.No_ || '',
  //       name: selectedVendor?.Name || '',
  //       address: selectedVendor?.Address || '',
  //       address2: selectedVendor?.['Address 2'] || '',
  //       post_code: selectedVendor?.['Post Code'] || '',
  //       country_region_code: selectedVendor?.['Country_Region Code'] || '',
  //       state_code: selectedVendor?.['State Code'] || '',
  //       phone: selectedVendor?.['Phone No_'] || '',
  //       city: selectedVendor?.City || '',
  //       search_name: selectedVendor?.['Search Name'] || '',
  //       vendor_account_no: selectedVendor?.['Vendor Account No_'] || '',
  //       ifsc_code: selectedVendor?.['IFSC Code'] || '',
  //       bank_name: selectedVendor?.['Bank Name'] || '',
  //       branch_address: selectedVendor?.['Branch Address'] || '',
  //       account_name: selectedVendor?.['Account Name'] || '',
  //       pro_discount: selectedVendor?.['Pro Discount _'] ?? 0,
  //       goverment_vendor: selectedVendor?.['Goverment Vendor'] ?? 0,
  //       security_guard: selectedVendor?.['Secuirity Gard'] ?? 0,
  //       parent_advocate: selectedVendor?.['Parent Advocate'] || '',
  //       parent_advocate_name: selectedVendor?.['Parent Advocate Name'] || '',
  //       gem_vendor: selectedVendor?.['GeM Vendor'] ?? 0,
  //       vendor_type: selectedVendor?.['Vendor Type'] ?? 0,
  //       blocked: selectedVendor?.['Blocked'] ?? 0,
  //       pan: selectedVendor?.PANNO || '',
  //       gst: selectedVendor?.GSTRegistrationNo || ''
  //     }
  //   ];

  //   formData.append('VendorsJson', JSON.stringify(vendorPayload));
  // }

  //     // ------------------
  //     // API Call (Create)
  //     // ------------------
  //     await createWorkOrder(formData);

  //     // ------------------
  //     // Success
  //     // ------------------
  //     setSuccess(`✅ Work Order #${data.work_order_no} created successfully!`);
  //     reset();
  //     setSelectedVendor(null);
  //     setSelectedDepartment(null);

  //     // redirect after 2 sec
  //     setTimeout(() => {
  //       navigate('/work-orders');
  //     }, 2000);
  //   } catch (err) {
  //     console.error('Submission error:', err);
  //     setError(err.message || '❌ Failed to create work order. Please try again.');
  //   }
  // };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      reset();
      setSelectedVendor(null);
      setSelectedDepartment(null);
      setError('');
      setSuccess('');
    }
  };

  // Loading state
  if (vendorsLoading || departmentsLoading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="fas fa-file-contract me-2"></i>
          Create Work Order
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/work-orders')}>
          <i className="fas fa-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      {/* Alerts */}
      <FormAlerts
        error={error}
        success={success}
        onClearError={() => setError('')}
        onClearSuccess={() => setSuccess('')}
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ProjectInfoSection control={control} errors={errors} touchedFields={touchedFields} />

        <VendorInfoSection
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          vendors={vendors}
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
        />

        <DepartmentInfoSection
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          departments={departments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />

        <DateInfoSection
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          watchedValues={watchedValues}
        />

        <FinancialInfoSection
          control={control}
          errors={errors}
          touchedFields={touchedFields}
          watchedValues={watchedValues}
        />

        <FileUploadSection
          control={control}
          errors={errors}
          watchedValues={watchedValues}
          setValue={setValue}
        />

        <RemarksSection control={control} errors={errors} watchedValues={watchedValues} />

        <ActionButtons
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          isSubmitting={submitting}
          isValid={isValid}
          errors={errors}
        />
      </form>
    </div>
  );
};

export default WorkOrderForm;
