import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const FinancialInfoSection = ({ control, errors, touchedFields, watchedValues }) => {
  const getFieldClass = (fieldName) => {
    let baseClass = 'form-control';
    if (touchedFields[fieldName] && errors[fieldName]) {
      baseClass += ' is-invalid';
    } else if (touchedFields[fieldName] && !errors[fieldName]) {
      baseClass += ' is-valid';
    }
    return baseClass;
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-rupee-sign me-2"></i>
              Financial Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Project Amount */}
              <div className="col-md-6">
                <label htmlFor="project_amount" className="form-label fw-semibold">
                  Project Amount <span className="text-danger">*</span>
                </label>
                <Controller
                  name="project_amount"
                  control={control}
                  render={({ field }) => (
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-rupee-sign"></i>
                      </span>
                      <input
                        {...field}
                        id="project_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        className={getFieldClass('project_amount')}
                        placeholder="Enter amount"
                      />
                    </div>
                  )}
                />
                {errors.project_amount && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.project_amount.message}
                  </div>
                )}
              </div>

              {/* Formatted Amount Display */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Formatted Amount</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-eye"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={
                      watchedValues.project_amount
                        ? formatCurrency(watchedValues.project_amount)
                        : ''
                    }
                    readOnly
                    placeholder="Amount preview"
                  />
                </div>
                <small className="text-muted">Auto-formatted display</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialInfoSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touchedFields: PropTypes.object.isRequired,
  watchedValues: PropTypes.object.isRequired,
};

export default FinancialInfoSection;
