import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

// Layouts
import AdminLayout from '@components/common/Layout/AdminLayout';
import AuthLayout from '@components/common/Layout/AuthLayout';

// Components
import ProtectedRoute from '@components/common/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from '@components/common/ErrorBoundary/ErrorBoundary';

// Lazy load pages for better performance
const Login = React.lazy(() => import('@pages/auth/LoginForm'));
const Dashboard = React.lazy(() => import('@pages/dashboard/Dashboard'));
// const InvoicesPage = React.lazy(() => import('@pages/invoices/InvoicesPage'));
// const CreateInvoice = React.lazy(() => import('@pages/invoices/CreateInvoice'));
// const EditInvoice = React.lazy(() => import('@pages/invoices/EditInvoice'));
// const PaymentsPage = React.lazy(() => import('@pages/payments/PaymentsPage'));
// const WorkOrdersPage = React.lazy(() => import('@pages/workorders/WorkOrdersPage'));
// const UsersPage = React.lazy(() => import('@pages/users/UsersPage'));
// const VendorsPage = React.lazy(() => import('@pages/vendors/VendorsPage'));
// const DepartmentsPage = React.lazy(() => import('@pages/departments/DepartmentsPage'));
// const NotFound = React.lazy(() => import('@pages/error/NotFound'));
// const Unauthorized = React.lazy(() => import('@pages/error/Unauthorized'));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <Spinner animation="border" variant="primary" size="lg" />
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Invoices */}
              {/* <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/create" element={<CreateInvoice />} />
              <Route path="invoices/:id/edit" element={<EditInvoice />} /> */}

              {/* Payments */}
              {/* <Route path="payments" element={<PaymentsPage />} /> */}

              {/* Work Orders */}
              {/* <Route path="work-orders" element={<WorkOrdersPage />} /> */}

              {/* Admin Routes - Restricted Access */}
              {/* <Route
                path="users"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'manager']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              /> */}

              {/* <Route
                path="vendors"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'manager']}>
                    <VendorsPage />
                  </ProtectedRoute>
                }
              /> */}

              {/* <Route
                path="departments"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              /> */}
            </Route>

            {/* Error Routes */}
            {/* <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;
