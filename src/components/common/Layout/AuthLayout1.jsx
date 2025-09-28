import React, { useState, useEffect } from 'react';
import './AuthLayout.css';

const AuthLayout1 = ({
  children,
  title = 'Bihar School Examination Board',
  subtitle = 'Integrated Financial Management System (IFMS)',
}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="auth-layout">
      {/* Header */}
      <header className="auth-header">
        <div className="auth-header-container">
          <div className="auth-header-brand">
            <div className="auth-logo">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='logoGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23logoGrad)'/%3E%3Cpath d='M30 35 L45 50 L70 30' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='35' cy='65' r='8' fill='white'/%3E%3Crect x='55' y='57' width='16' height='16' rx='2' fill='white'/%3E%3C/svg%3E"
                alt="Logo"
                className="auth-logo-img"
              />
            </div>
            <div className="auth-brand-text">
              <h1 className="auth-brand-title">{title}</h1>
              <p className="auth-brand-subtitle">{subtitle}</p>
            </div>
          </div>

          <div className="auth-header-actions">
            <button className="auth-help-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M9.09 9A3 3 0 0 1 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Help</span>
            </button>

            <div className="auth-language-selector">
              <button className="language-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 12C8 7.58 9.79 4 12 4S16 7.58 16 12 14.21 20 12 20 8 16.42 8 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-main-container">
          <div className="auth-content">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="auth-footer-container">
          <div className="auth-footer-content">
            <div className="auth-footer-left">
              <p className="auth-copyright">
                © {currentYear} Bihar School Examination Board. All rights reserved.
              </p>
            </div>

            <div className="auth-footer-center">
              <div className="auth-footer-links">
                <a href="/privacy" className="auth-footer-link">
                  Privacy Policy
                </a>
                <span className="auth-footer-separator">•</span>
                <a href="/terms" className="auth-footer-link">
                  Terms of Service
                </a>
                <span className="auth-footer-separator">•</span>
                <a href="/support" className="auth-footer-link">
                  Support
                </a>
              </div>
            </div>

            {/* <div className="auth-footer-right">
              <div className="auth-social-links">
                <a href="#" className="auth-social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.412C10.125 6.388 11.917 4.715 14.658 4.715C15.97 4.715 17.344 4.953 17.344 4.953V7.922H15.83C14.34 7.922 13.875 8.853 13.875 9.808V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z" />
                  </svg>
                </a>
                <a href="#" className="auth-social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57A10 10 0 0 1 20.946 6.034 4.48 4.48 0 0 0 23.337 2.29A8.72 8.72 0 0 1 20.61 3.58A4.479 4.479 0 0 0 16.616 2C13.437 2 10.845 4.592 10.845 7.77C10.845 8.153 10.888 8.528 10.974 8.887C7.163 8.694 3.8 6.386 1.549 3.004A4.505 4.505 0 0 0 0.94 5.555C0.94 7.625 1.995 9.447 3.565 10.524A4.44 4.44 0 0 1 1.536 9.944V9.973C1.536 12.789 3.551 15.136 6.24 15.598A4.495 4.495 0 0 1 4.026 15.67C4.732 17.985 6.927 19.677 9.536 19.729A8.985 8.985 0 0 1 1.111 21.485A12.704 12.704 0 0 0 7.291 23.216C16.604 23.216 21.74 15.67 21.74 9.003C21.74 8.79 21.735 8.579 21.725 8.369C22.721 7.624 23.574 6.688 24.221 5.624L23.953 4.57Z" />
                  </svg>
                </a>
                <a href="#" className="auth-social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" />
                  </svg>
                </a>
              </div>
            </div> */}
          </div>

          {/* <div className="auth-footer-bottom">
            <div className="auth-footer-badge">
              <span className="auth-security-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22S2 16 2 8L12 2L22 8C22 16 12 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Secured by SSL
              </span>
            </div>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout1;
