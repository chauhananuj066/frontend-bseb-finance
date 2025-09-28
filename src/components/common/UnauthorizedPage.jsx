// components/common/UnauthorizedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7V13H10V7H12ZM12 15V17H10V15H12Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h1>Access Denied</h1>
      <p>You don't have permission to access this resource.</p>
      <div className="error-actions">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// components/common/NotFoundPage.jsx
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 16L8 8M8 16L16 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="error-actions">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// components/common/PersistGateLoading.jsx
const PersistGateLoading = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
    <p>Loading application...</p>
  </div>
);

export { UnauthorizedPage, NotFoundPage, PersistGateLoading };
