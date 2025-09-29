import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const FileUploadSection = ({ control, errors, watchedValues, setValue }) => {
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      field.onChange(file);
      setValue('work_order_file_name', file.name);
    }
  };

  const clearFile = (field) => {
    field.onChange(null);
    setValue('work_order_file_name', '');
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">
              <i className="fas fa-file-upload me-2"></i>
              Document Upload
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="work_order_file_uploaded" className="form-label fw-semibold">
                  Work Order File <span className="text-muted">(Optional, PDF only)</span>
                </label>
                <Controller
                  name="work_order_file_uploaded"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        id="work_order_file_uploaded"
                        type="file"
                        accept="application/pdf"
                        className={`form-control ${errors.work_order_file_uploaded ? 'is-invalid' : ''}`}
                        onChange={(e) => handleFileChange(e, field)}
                      />
                      {field.value && (
                        <div className="mt-2">
                          <div className="alert alert-success d-flex justify-content-between align-items-center">
                            <div>
                              <i className="fas fa-file-pdf me-2"></i>
                              <strong>Selected:</strong> {field.value.name}
                              <br />
                              <small className="text-muted">
                                Size: {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </small>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => clearFile(field)}
                            >
                              <i className="fas fa-times"></i> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
                {errors.work_order_file_uploaded && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.work_order_file_uploaded.message}
                  </div>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Maximum file size: 5MB | Allowed format: PDF only
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FileUploadSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  watchedValues: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default FileUploadSection;
