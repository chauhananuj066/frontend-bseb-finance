import React from 'react';
import PropTypes from 'prop-types';

const ActionButtons = ({ onSubmit, onReset, isSubmitting, isValid, errors }) => {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              {/* Form Status */}
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center">
                  <i
                    className={`fas ${
                      isValid
                        ? 'fa-check-circle text-success'
                        : 'fa-exclamation-triangle text-warning'
                    } me-2`}
                  ></i>
                  <span className={isValid ? 'text-success fw-medium' : 'text-warning fw-medium'}>
                    {isValid ? 'Form Valid' : 'Form Incomplete'}
                  </span>
                </div>
                {hasErrors && (
                  <div className="text-danger small">
                    <i className="fas fa-times-circle me-1"></i>
                    {Object.keys(errors).length} error(s) found
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onReset}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-undo me-2"></i>
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onSubmit}
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Create Work Order
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Summary */}
            {hasErrors && (
              <div className="mt-3 pt-3 border-top">
                <div className="alert alert-danger mb-0">
                  <div className="fw-medium mb-2">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Please fix the following errors:
                  </div>
                  <ul className="mb-0 small">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ActionButtons.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ActionButtons;
