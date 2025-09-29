import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const RemarksSection = ({ control, errors, watchedValues }) => {
  const remainingChars = 500 - (watchedValues.remark?.length || 0);

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="fas fa-sticky-note me-2"></i>
              Additional Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="remark" className="form-label fw-semibold">
                  Remarks <span className="text-muted">(Optional)</span>
                </label>
                <Controller
                  name="remark"
                  control={control}
                  render={({ field }) => (
                    <div className="position-relative">
                      <textarea
                        {...field}
                        id="remark"
                        rows="4"
                        className={`form-control ${errors.remark ? 'is-invalid' : ''}`}
                        placeholder="Enter any additional notes or comments..."
                        maxLength={500}
                      />
                      <div
                        className={`position-absolute top-0 end-0 me-2 mt-2 small ${
                          remainingChars < 50 ? 'text-warning fw-medium' : 'text-muted'
                        }`}
                        style={{ pointerEvents: 'none' }}
                      >
                        {remainingChars} chars left
                      </div>
                    </div>
                  )}
                />
                {errors.remark && (
                  <div className="invalid-feedback d-block">{errors.remark.message}</div>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Maximum 500 characters
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RemarksSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  watchedValues: PropTypes.object.isRequired,
};

export default RemarksSection;
