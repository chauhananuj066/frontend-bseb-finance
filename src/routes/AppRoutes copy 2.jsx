import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

// Layouts
import AdminLayout from '@components/common/Layout/AdminLayout';
import AuthLayout from '@components/common/Layout/AuthLayout';

// Components
import ErrorBoundary from '@components/common/ErrorBoundary/ErrorBoundary';

// Lazy-loaded pages
const Login = React.lazy(() => import('@pages/auth/LoginForm'));
const Dashboard = React.lazy(() => import('@pages/dashboard/Dashboard'));
const UsersPage = React.lazy(() => import('@pages/users/UsersPage'));
const CreateUser = React.lazy(() => import('@pages/users/CreateUser'));
const EditUser = React.lazy(() => import('@pages/users/EditUser'));
const DepartmentsPage = React.lazy(() => import('@pages/departments/DepartmentsPage'));
// You can lazy load more pages as needed here

// Spinner shown during lazy load
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <Spinner animation="border" variant="primary" size="lg" />
  </div>
);

// Wrapper for protected routes
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Wrapper for guest-only routes
const RequireNoAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      // Add more protected nested routes here as needed
    ],
  },
  {
    path: '/login',
    element: (
      <RequireNoAuth>
        <AuthLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        </AuthLayout>
      </RequireNoAuth>
    ),
  },
  // Optional: 404 Not Found Route
  // {
  //   path: '*',
  //   element: <NotFoundPage />,
  // },
];

// ✅ Enable v7 features to avoid future warnings
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

// Final AppRoutes component
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
