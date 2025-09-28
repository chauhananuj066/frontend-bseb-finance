// Production-Grade Login Component - Redux Integrated
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCaptchaAsync, loginAsync, clearError } from '../../store/slices/authSlice';
import { setUserData, setSessionId } from '../../services/api/client';

import { toast } from 'react-hot-toast';
import './LoginComponent.css';

const Login = ({
  onLoginSuccess = () => {},
  onLoginError = () => {},
  redirectTo = '/dashboard',
}) => {
  // Redux state management
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    captcha,
    loading,
    error: authError,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // Local form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Auto redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Load CAPTCHA on component mount
  useEffect(() => {
    if (!captcha.image || !captcha.sessionId) {
      dispatch(getCaptchaAsync());
    }
  }, [dispatch, captcha.image, captcha.sessionId]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      if (authError) {
        dispatch(clearError());
      }
    };
  }, [authError, dispatch]);

  // Form validation with enhanced rules
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // CAPTCHA validation
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'Security code is required';
    } else if (formData.captcha.length < 4) {
      newErrors.captcha = 'Please enter the complete security code';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Clear auth error when user makes changes
    if (authError && retryCount > 0) {
      dispatch(clearError());
    }
  };

  // Production-grade form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    // Check if CAPTCHA is available
    if (!captcha.sessionId) {
      toast.error('Security verification not available. Please refresh.');
      dispatch(getCaptchaAsync());
      return;
    }

    try {
      // Clear previous errors
      dispatch(clearError());
      setFormErrors({});

      // Prepare login credentials for Redux action
      const credentials = {
        username: formData.email, // Backend expects username field
        email: formData.email,
        password: formData.password,
        captcha: formData.captcha,
        sessionId: captcha.sessionId,
        // Optional fields for backend compatibility
        role: '',
        department: '',
      };

      console.log('🚀 Attempting login with Redux...', {
        email: credentials.email,
        sessionId: captcha.sessionId?.substring(0, 20) + '...',
        captchaLength: formData.captcha.length,
      });

      // Dispatch Redux login action
      const result = await dispatch(loginAsync(credentials)).unwrap();

      // Success handling
      console.log('✅ Login successful:', result);

      // MANUAL SESSION DATA STORAGE - FIX FOR REDIRECT ISSUE
      const userData = {
        userId: result.userId || result.data?.userId,
        email: result.email || result.data?.email,
        role: result.role || result.data?.role,
        department: result.department || result.data?.department,
      };

      // Store session data manually using client functions
      setUserData(userData);
      setSessionId(credentials.sessionId);

      // Set last activity timestamp
      localStorage.setItem('bseb_last_activity', Date.now().toString());

      console.log('📝 Session data stored manually:', {
        userData,
        sessionId: credentials.sessionId,
      });

      toast.success('Login successful! Redirecting...', {
        duration: 2000,
        icon: '🎉',
      });

      // Reset form and retry count on success
      setRetryCount(0);
      setFormData((prev) => ({ ...prev, captcha: '' }));

      // Call success callback
      onLoginSuccess(result);

      // Navigate after short delay for UX
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1000);
    } catch (error) {
      console.error('❌ Login failed:', error);

      // Increment retry count
      setRetryCount((prev) => prev + 1);

      // Show user-friendly error message
      const errorMessage = error || 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage, {
        duration: 5000,
        icon: '⚠️',
      });

      // Call error callback
      onLoginError(error);

      // Refresh CAPTCHA on failure and clear CAPTCHA input
      dispatch(getCaptchaAsync());
      setFormData((prev) => ({ ...prev, captcha: '' }));

      // Focus on CAPTCHA input after refresh
      setTimeout(() => {
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) captchaInput.focus();
      }, 500);
    }
  };

  // Refresh CAPTCHA manually
  const handleRefreshCaptcha = () => {
    setFormData((prev) => ({ ...prev, captcha: '' }));
    dispatch(getCaptchaAsync());
    toast.info('Security code refreshed', { duration: 2000 });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Alt + R to refresh CAPTCHA
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        handleRefreshCaptcha();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Get display error (prioritize form errors over auth errors)
  const getDisplayError = (field) => {
    return formErrors[field] || (field === 'general' && authError);
  };

  // Enhanced loading state
  const isSubmitting = loading;

  return (
    <div className="login-container-inner">
      <div className="login-card">
        {/* Enhanced Login Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Secure access to Bihar School Examination Board IFMS
            {retryCount > 0 && <span className="retry-indicator"> • Attempt {retryCount + 1}</span>}
          </p>
        </div>

        {/* Production-grade Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Global Error Message */}
          {getDisplayError('general') && (
            <div className="error-message general-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
              </svg>
              {getDisplayError('general')}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${getDisplayError('email') ? 'error' : ''}`}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={isSubmitting}
                required
                aria-invalid={!!getDisplayError('email')}
                aria-describedby={getDisplayError('email') ? 'email-error' : undefined}
              />
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22,6 12,13 2,6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {getDisplayError('email') && (
              <span id="email-error" className="error-text" role="alert">
                {getDisplayError('email')}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="input-container password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${getDisplayError('password') ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
                aria-invalid={!!getDisplayError('password')}
                aria-describedby={getDisplayError('password') ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.94 17.94C16.2 19.24 14.16 20 12 20C7.58 20 3.79 16.86 2.06 12C3.27 9.1 5.59 6.8 8.47 5.69M9.9 4.24C10.59 4.08 11.3 4 12 4C16.42 4 20.21 7.14 21.94 12C21.25 13.81 20.12 15.37 18.69 16.57M12 8C14.21 8 16 9.79 16 12C16 12.97 15.68 13.87 15.12 14.58M8 12C8 9.79 9.79 8 12 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 12C1 12 5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
            {getDisplayError('password') && (
              <span id="password-error" className="error-text" role="alert">
                {getDisplayError('password')}
              </span>
            )}
          </div>

          {/* Enhanced CAPTCHA Field */}
          <div className="form-group">
            <label htmlFor="captcha" className="form-label">
              Security Code <span className="required">*</span>
              <span className="captcha-hint">(Alt + R to refresh)</span>
            </label>
            <div className="captcha-container">
              <div className="captcha-image-container">
                {loading && !captcha.image ? (
                  <div className="captcha-placeholder loading">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) : captcha.image ? (
                  <img
                    src={captcha.image}
                    alt="Security verification code"
                    className="captcha-image"
                    loading="eager"
                  />
                ) : (
                  <div className="captcha-placeholder error">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
                      <line
                        x1="12"
                        y1="16"
                        x2="12.01"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Failed to load</span>
                  </div>
                )}

                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={handleRefreshCaptcha}
                  disabled={isSubmitting}
                  title="Refresh security code (Alt + R)"
                  aria-label="Refresh security code"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline
                      points="23 4 23 10 17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="1 20 1 14 7 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.49 9C20.06 7.8 19.38 6.71 18.49 5.78C16.28 3.57 13.39 2.75 10.49 3.32C7.59 3.89 5.31 5.75 4.2 8.36M3.51 15C3.94 16.2 4.62 17.29 5.51 18.22C7.72 20.43 10.61 21.25 13.51 20.68C16.41 20.11 18.69 18.25 19.8 15.64"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <input
                type="text"
                id="captcha"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
                className={`form-input captcha-input ${getDisplayError('captcha') ? 'error' : ''}`}
                placeholder="Enter security code"
                autoComplete="off"
                disabled={isSubmitting}
                required
                maxLength={10}
                aria-invalid={!!getDisplayError('captcha')}
                aria-describedby={getDisplayError('captcha') ? 'captcha-error' : 'captcha-help'}
              />
            </div>

            {getDisplayError('captcha') && (
              <span id="captcha-error" className="error-text" role="alert">
                {getDisplayError('captcha')}
              </span>
            )}

            <div id="captcha-help" className="form-help">
              Enter the characters shown in the image above
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            className={`login-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting || !captcha.sessionId}
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <>
                <div className="button-spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="10,17 15,12 10,7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="15"
                    y1="12"
                    x2="3"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Sign In Securely</span>
              </>
            )}
          </button>

          {/* <div id="submit-help" className="form-help">
            By signing in, you agree to our terms and privacy policy
          </div> */}
        </form>

        {/* Enhanced Footer */}
        {/* <div className="login-footer-inner">
          <div className="footer-links">
            <a href="/forgot-password" className="footer-link-inner">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Forgot Password?
            </a>
            <span className="footer-separator">•</span>
            <a href="/support" className="footer-link-inner">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9A3 3 0 0 1 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Contact Support
            </a>
          </div>
          
           Security badge 
          <div className="security-badge">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22S2 16 2 8L12 2L22 8C22 16 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secured by SSL Encryption
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
