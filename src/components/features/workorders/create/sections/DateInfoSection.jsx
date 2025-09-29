import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const DateInfoSection = ({ control, errors, touchedFields, watchedValues }) => {
  const today = new Date().toISOString().split('T')[0];

  const getFieldClass = (fieldName) => {
    let baseClass = 'form-control';
    if (touchedFields[fieldName] && errors[fieldName]) {
      baseClass += ' is-invalid';
    } else if (touchedFields[fieldName] && !errors[fieldName]) {
      baseClass += ' is-valid';
    }
    return baseClass;
  };

  // Calculate duration
  const duration = useMemo(() => {
    if (watchedValues.order_from_date && watchedValues.order_to_date) {
      const from = new Date(watchedValues.order_from_date);
      const to = new Date(watchedValues.order_to_date);
      const diffTime = to - from;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  }, [watchedValues.order_from_date, watchedValues.order_to_date]);

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              <i className="fas fa-calendar-alt me-2"></i>
              Date Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Issue Date */}
              <div className="col-md-6">
                <label htmlFor="issue_date" className="form-label fw-semibold">
                  Issue Date <span className="text-danger">*</span>
                </label>
                <Controller
                  name="issue_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="issue_date"
                      type="date"
                      min={today}
                      className={getFieldClass('issue_date')}
                    />
                  )}
                />
                {errors.issue_date && (
                  <div className="invalid-feedback d-block">{errors.issue_date.message}</div>
                )}
              </div>

              {/* Order Date */}
              <div className="col-md-6">
                <label htmlFor="order_date" className="form-label fw-semibold">
                  Order Date <span className="text-danger">*</span>
                </label>
                <Controller
                  name="order_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="order_date"
                      type="date"
                      className={getFieldClass('order_date')}
                    />
                  )}
                />
                {errors.order_date && (
                  <div className="invalid-feedback d-block">{errors.order_date.message}</div>
                )}
              </div>

              {/* Order From Date */}
              <div className="col-md-6">
                <label htmlFor="order_from_date" className="form-label fw-semibold">
                  Order From Date <span className="text-danger">*</span>
                </label>
                <Controller
                  name="order_from_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="order_from_date"
                      type="date"
                      min={watchedValues.issue_date || today}
                      className={getFieldClass('order_from_date')}
                    />
                  )}
                />
                {errors.order_from_date && (
                  <div className="invalid-feedback d-block">{errors.order_from_date.message}</div>
                )}
              </div>

              {/* Order To Date */}
              <div className="col-md-6">
                <label htmlFor="order_to_date" className="form-label fw-semibold">
                  Order To Date <span className="text-muted">(Optional)</span>
                </label>
                <Controller
                  name="order_to_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="order_to_date"
                      type="date"
                      min={watchedValues.order_from_date || today}
                      className={getFieldClass('order_to_date')}
                    />
                  )}
                />
                {errors.order_to_date && (
                  <div className="invalid-feedback d-block">{errors.order_to_date.message}</div>
                )}
              </div>

              {/* Duration Display */}
              {duration > 0 && (
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    <i className="fas fa-clock me-2"></i>
                    <strong>Contract Duration:</strong> {duration} days
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

DateInfoSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touchedFields: PropTypes.object.isRequired,
  watchedValues: PropTypes.object.isRequired,
};

export default DateInfoSection;
