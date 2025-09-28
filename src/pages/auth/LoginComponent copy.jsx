// Login Component Integration - Session Based
import React, { useState, useEffect } from 'react';
import './LoginComponent.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../store/slices/authSlice.js';

const LoginComponent = ({ onLoginSuccess = () => {}, onLoginError = () => {} }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
    sessionId: '',
  });
  const [captchaImage, setCaptchaImage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Fetch captcha on mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await fetch('https://localhost:7020/api/Auth/captcha', {
        method: 'GET',
        headers: { accept: '*/*' },
      });
      if (response.ok) {
        const captchaData = await response.json();
        setCaptchaImage(captchaData.image || captchaData.captchaImage);
        setFormData((prev) => ({ ...prev, sessionId: captchaData.sessionId }));
      } else {
        throw new Error('Failed to fetch captcha');
      }
    } catch (err) {
      console.error('Captcha fetch error:', err);
      setErrors({ general: 'Failed to load captcha. Please try again.' });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long';

    if (!formData.captcha.trim()) newErrors.captcha = 'Captcha is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrors({});

    try {
      const result = await dispatch(
        loginAsync({
          id: 0,
          username: formData.username || '',
          password_hash: formData.password,
          email: formData.email,
          role: formData.role || '',
          department: formData.department || '',
          captcha: formData.captcha,
          sessionId: formData.sessionId,
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        onLoginSuccess && onLoginSuccess(result.payload);
        navigate('/dashboard');
      } else {
        throw new Error(result.payload || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: err.message || 'Login failed. Please try again.' });
      onLoginError && onLoginError(err);
      await fetchCaptcha();
      setFormData((prev) => ({ ...prev, captcha: '' }));
    }
  };

  // Refresh captcha manually
  const refreshCaptcha = () => {
    setFormData((prev) => ({ ...prev, captcha: '' }));
    fetchCaptcha();
  };

  const displayError = error || errors.general;

  return (
    <div className="login-container-inner">
      <div className="login-card">
        {/* Login Header */}
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
          <p className="login-subtitle">Experience the future of secure authentication</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {displayError && <div className="error-message general-error">{displayError}</div>}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Captcha */}
          <div className="form-group">
            <label htmlFor="captcha" className="form-label">
              Security Code
            </label>
            <div className="captcha-container">
              {captchaImage ? (
                <img src={captchaImage} alt="Captcha" className="captcha-image" />
              ) : (
                <div className="captcha-placeholder">Loading...</div>
              )}
              <button
                type="button"
                className="captcha-refresh"
                onClick={refreshCaptcha}
                disabled={loading}
              >
                ↻
              </button>
              <input
                type="text"
                id="captcha"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
                className={`form-input captcha-input ${errors.captcha ? 'error' : ''}`}
                placeholder="Enter the code"
                autoComplete="off"
                disabled={loading}
              />
            </div>
            {errors.captcha && <span className="error-text">{errors.captcha}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer-inner">
          <a href="/forgot-password" className="footer-link-inner">
            Forgot Password?
          </a>
          <a href="/support" className="footer-link-inner">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
