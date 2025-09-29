import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const ProjectInfoSection = ({ control, errors, touchedFields }) => {
  const getFieldClass = (fieldName) => {
    let baseClass = 'form-control';
    if (touchedFields[fieldName] && errors[fieldName]) {
      baseClass += ' is-invalid';
    } else if (touchedFields[fieldName] && !errors[fieldName]) {
      baseClass += ' is-valid';
    }
    return baseClass;
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Project Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Work Order Number */}
              <div className="col-md-6">
                <label htmlFor="work_order_no" className="form-label fw-semibold">
                  Work Order Number <span className="text-danger">*</span>
                </label>
                <Controller
                  name="work_order_no"
                  control={control}
                  render={({ field }) => (
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-hashtag"></i>
                      </span>
                      <input
                        {...field}
                        id="work_order_no"
                        type="text"
                        className={getFieldClass('work_order_no')}
                        placeholder="WO-2024-001"
                      />
                    </div>
                  )}
                />
                {errors.work_order_no && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.work_order_no.message}
                  </div>
                )}
              </div>

              {/* Project Number */}
              <div className="col-md-6">
                <label htmlFor="project_no" className="form-label fw-semibold">
                  Project Number <span className="text-danger">*</span>
                </label>
                <Controller
                  name="project_no"
                  control={control}
                  render={({ field }) => (
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-project-diagram"></i>
                      </span>
                      <input
                        {...field}
                        id="project_no"
                        type="text"
                        className={getFieldClass('project_no')}
                        placeholder="PRJ-2024-001"
                      />
                    </div>
                  )}
                />
                {errors.project_no && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.project_no.message}
                  </div>
                )}
              </div>

              {/* Reference Tender */}
              <div className="col-12">
                <label htmlFor="reference_tender" className="form-label fw-semibold">
                  Reference Tender <span className="text-muted">(Optional)</span>
                </label>
                <Controller
                  name="reference_tender"
                  control={control}
                  render={({ field }) => (
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-link"></i>
                      </span>
                      <input
                        {...field}
                        id="reference_tender"
                        type="text"
                        className={getFieldClass('reference_tender')}
                        placeholder="TENDER-2024-001"
                      />
                    </div>
                  )}
                />
                {errors.reference_tender && (
                  <div className="invalid-feedback d-block">{errors.reference_tender.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectInfoSection.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touchedFields: PropTypes.object.isRequired,
};

export default ProjectInfoSection;
