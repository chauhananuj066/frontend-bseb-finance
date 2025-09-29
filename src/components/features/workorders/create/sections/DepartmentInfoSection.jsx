import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import PropTypes from 'prop-types';

const DepartmentInfoSection = ({
  control,
  errors,
  touchedFields,
  departments,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.department_name,
    data: dept,
  }));

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused
        ? '#0d6efd'
        : touchedFields.department_name && errors.department_name
          ? '#dc3545'
          : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="fas fa-building me-2"></i>
              Department Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="department_name" className="form-label fw-semibold">
                  Select Department <span className="text-danger">*</span>
                </label>

                <Controller
                  name="department_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={departmentOptions}
                      value={departmentOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(option) => {
                        field.onChange(option?.value || null);
                        setSelectedDepartment(option?.data || null);
                      }}
                      placeholder="Select department..."
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  )}
                />

                {errors.department_name && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.department_name.message}
                  </div>
                )}
              </div>

              {/* Selected Department Details */}
              {selectedDepartment && (
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      <div>
                        <strong>Selected Department:</strong> {selectedDepartment.department_name}
                        <br />
                        <small>Department ID: {selectedDepartment.id}</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DepartmentInfoSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touchedFields: PropTypes.object.isRequired,
  departments: PropTypes.array.isRequired,
  selectedDepartment: PropTypes.object,
  setSelectedDepartment: PropTypes.func.isRequired,
};

export default DepartmentInfoSection;
