// Login Component Integration - Session Based (FIXED)
import React, { useState, useEffect } from 'react';
import './LoginComponent.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLoginSuccess = () => {}, onLoginError = () => {} }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
  });

  // Working Login.jsx ke same variables
  const [captchaImage, setCaptchaImage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Step 1: Get CAPTCHA when component mounts (Working Login.jsx logic)
  const fetchCaptcha = async () => {
    try {
      const response = await axios.get('https://localhost:7020/api/Auth/captcha');
      setCaptchaImage(response.data.image);
      setSessionId(response.data.sessionId);
      setMessage('');
      setErrors({});
    } catch (error) {
      console.error('Error fetching captcha:', error);
      setErrors({ general: 'CAPTCHA लोड करने में समस्या हुई' });
      setMessage('CAPTCHA load failed');
    }
  };

  // Fetch captcha on mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

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
    if (message) setMessage('');
  };

  // Step 2: Handle login submit (Working Login.jsx exact logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      // Working Login.jsx ke same query params
      const queryParams = new URLSearchParams({
        sessionId: sessionId,
        captcha: formData.captcha,
      }).toString();

      // Working Login.jsx ke same body structure
      const body = {
        id: 0,
        username: formData.email, // Email ko username ki tarah use kar rahe hain
        password_hash: formData.password,
        email: formData.email,
        role: '',
        department: '',
        created_at: new Date().toISOString(),
      };

      // Working Login.jsx ke same API call
      const response = await axios.post(
        `https://localhost:7020/api/Auth/login?${queryParams}`,
        body
      );

      setMessage('Login सफल! ✅');
      console.log('Login Success:', response.data);

      // Success callbacks
      onLoginSuccess && onLoginSuccess(response.data);

      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = 'Login असफल ❌ कृपया CAPTCHA और credentials जाँचे';
      setMessage(errorMessage);
      setErrors({ general: errorMessage });

      // Error callback
      onLoginError && onLoginError(error);

      // Working Login.jsx ke same - Refresh CAPTCHA on failure
      await fetchCaptcha();
      setFormData((prev) => ({ ...prev, captcha: '' }));
    } finally {
      setLoading(false);
    }
  };

  // Refresh captcha manually
  const refreshCaptcha = () => {
    setFormData((prev) => ({ ...prev, captcha: '' }));
    fetchCaptcha();
  };

  const displayError = errors.general;
  const displayMessage = message;

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
          {displayMessage && !displayError && (
            <div
              className={`message ${displayMessage.includes('सफल') ? 'success-message' : 'info-message'}`}
            >
              {displayMessage}
            </div>
          )}

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
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
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
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Captcha */}
          <div className="form-group">
            <label htmlFor="captcha" className="form-label">
              Security Code
            </label>
            <div className="captcha-container">
              <div className="captcha-image-container">
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
                  title="🔄 CAPTCHA Refresh"
                >
                  🔄
                </button>
              </div>
              <input
                type="text"
                id="captcha"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
                className={`form-input captcha-input ${errors.captcha ? 'error' : ''}`}
                placeholder="CAPTCHA टाइप करें"
                autoComplete="off"
                disabled={loading}
                required
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

export default Login;
