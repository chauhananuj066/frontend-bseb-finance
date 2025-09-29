import React from 'react';
import PropTypes from 'prop-types';

const FormAlerts = ({ error, success, onClearError, onClearSuccess }) => {
  if (!error && !success) return null;

  return (
    <div className="mb-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <div className="d-flex align-items-start">
            <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
            <div className="flex-grow-1">
              <strong>Error!</strong>
              <div className="mt-1">{error}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClearError}
            aria-label="Close"
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <div className="d-flex align-items-start">
            <i className="fas fa-check-circle me-2 mt-1"></i>
            <div className="flex-grow-1">
              <strong>Success!</strong>
              <div className="mt-1">{success}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClearSuccess}
            aria-label="Close"
          ></button>
        </div>
      )}
    </div>
  );
};

FormAlerts.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string,
  onClearError: PropTypes.func.isRequired,
  onClearSuccess: PropTypes.func.isRequired,
};

export default FormAlerts;
