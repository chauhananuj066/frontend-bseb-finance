// components/auth/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { validateSessionAsync, clearAuth } from '../../../store/slices/authSlice.JS';
import { sessionManager } from '../../../services/api/client.JS';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  allowedRoles = null,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, loading, user, sessionId } = useSelector((state) => state.auth);

  useEffect(() => {
    // Validate session on route access
    if (requireAuth && sessionId && !sessionManager.isExpired()) {
      dispatch(validateSessionAsync());
    } else if (requireAuth && sessionManager.isExpired()) {
      dispatch(clearAuth());
    }
  }, [dispatch, requireAuth, sessionId]);

  // Loading state
  if (loading) {
    return (
      <div className="route-loading">
        <div className="loading-spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  // Authentication check
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Role-based access control
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
