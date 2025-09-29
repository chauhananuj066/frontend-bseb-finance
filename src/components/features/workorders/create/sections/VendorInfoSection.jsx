import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import PropTypes from 'prop-types';

const VendorInfoSection = ({
  control,
  errors,
  touchedFields,
  vendors,
  selectedVendor,
  setSelectedVendor,
}) => {
  const vendorOptions = vendors.map((vendor, index) => ({
    //value: vendor.No_,
    value: index + 1, // int (1,2,3...) assign kar diya
    label: `${vendor.Name} - ${vendor.City}`,
    data: vendor,
  }));

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused
        ? '#0d6efd'
        : touchedFields.vendor_name && errors.vendor_name
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
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-building me-2"></i>
              Vendor Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="vendor_name" className="form-label fw-semibold">
                  Select Vendor <span className="text-danger">*</span>
                </label>
                <Controller
                  name="vendor_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="vendor_name" // <- label ke saath link ho jaayega
                      options={vendorOptions}
                      value={vendorOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(option) => {
                        field.onChange(option?.value || null);
                        setSelectedVendor(option?.data || null);
                      }}
                      placeholder="Search and select vendor..."
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  )}
                />

                {errors.vendor_name && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.vendor_name.message}
                  </div>
                )}
              </div>

              {/* Selected Vendor Details */}
              {selectedVendor && (
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-light">
                      <h6 className="mb-0 text-info">
                        <i className="fas fa-info-circle me-2"></i>
                        Selected Vendor Details
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col-md-6">
                          <small className="text-muted d-block">Vendor Name:</small>
                          <strong>{selectedVendor.Name}</strong>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted d-block">City:</small>
                          <span>{selectedVendor.City}</span>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted d-block">Vendor No:</small>
                          <span className="font-monospace">{selectedVendor.No_}</span>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Phone:</small>
                          <span>{selectedVendor['Phone No_'] || 'N/A'}</span>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">GST Number:</small>
                          <span className="font-monospace">
                            {selectedVendor.gstNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">PAN Number:</small>
                          <span className="font-monospace">
                            {selectedVendor.panNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="col-12">
                          <small className="text-muted d-block">Address:</small>
                          <span>
                            {selectedVendor.Address}
                            {selectedVendor['Address 2'] && `, ${selectedVendor['Address 2']}`}
                          </span>
                        </div>
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

VendorInfoSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touchedFields: PropTypes.object.isRequired,
  vendors: PropTypes.array.isRequired,
  selectedVendor: PropTypes.object,
  setSelectedVendor: PropTypes.func.isRequired,
};

export default VendorInfoSection;
