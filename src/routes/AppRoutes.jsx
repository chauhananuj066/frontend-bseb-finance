import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '@components/common/Layout/AdminLayout';
import AuthLayout from '@components/common/Layout/AuthLayout1';

// Utils
import { createLazyComponent } from '@utils/performance/lazyLoader';

// Protected Route
import ProtectedRoute from '@/components/common/ProtectedRoute/ProtectedRoute';

// Auth Pages (lazy-loaded)
const Login = createLazyComponent(() => import('@pages/auth/LoginComponent'));

// Dashboard Pages
const Dashboard = createLazyComponent(() => import('@pages/dashboard/Dashboard'));

// User Management Pages
const UsersPage = createLazyComponent(() => import('@pages/users/UsersPage'));
const CreateUser = createLazyComponent(() => import('@pages/users/CreateUser'));
const EditUser = createLazyComponent(() => import('@pages/users/EditUser'));

// Department Pages
const DepartmentsPage = createLazyComponent(() => import('@pages/departments/DepartmentsPage'));

// Work Order Pages
const WorkOrdersList = createLazyComponent(() => import('@pages/workorders/WorkOrdersList'));
const CreateWorkOrder = createLazyComponent(() => import('@pages/workorders/CreateWorkOrder'));
const WorkOrderDetail = createLazyComponent(() => import('@pages/workorders/WorkOrderDetail'));

// Invoice Pages (Future)
const InvoicesPage = createLazyComponent(() => import('@pages/invoices/InvoicePage'));

// Error Pages
const UnauthorizedPage = createLazyComponent(() => import('@components/common/UnauthorizedPage'));

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - All Authenticated Users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<div>Profile Page (TODO)</div>} />
          <Route path="settings" element={<div>Settings Page (TODO)</div>} />

          {/* Work Orders - All authenticated users can view */}
          <Route path="work-orders" element={<WorkOrdersList />} />
          <Route path="work-orders/:id" element={<WorkOrderDetail />} />
        </Route>
      </Route>

      {/* Department Users - Can create work orders */}
      <Route
        element={
          <ProtectedRoute requiredRoles={['admin', 'manager', 'department', 'FinanceOfficer']} />
        }
      >
        <Route path="/" element={<AdminLayout />}>
          <Route path="work-orders/create" element={<CreateWorkOrder />} />
          <Route path="work-orders" element={<WorkOrdersList />} />
          <Route path="work-orders/:id" element={<WorkOrderDetail />} />

          {/* Invoices - Department can upload */}
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>
      </Route>

      {/* Admin/Manager Only Routes */}
      <Route
        element={
          <ProtectedRoute requiredRoles={['admin', 'manager', 'department', 'FinanceOfficer']} />
        }
      >
        <Route path="/" element={<AdminLayout />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="reports" element={<div>Reports Page (TODO)</div>} />
          <Route path="analytics" element={<div>Analytics Page (TODO)</div>} />
        </Route>
      </Route>

      {/* Admin Only Routes */}
      <Route
        element={
          <ProtectedRoute requiredRoles={['admin', 'manager', 'department', 'FinanceOfficer']} />
        }
      >
        <Route path="/" element={<AdminLayout />}>
          <Route path="admin" element={<div>Admin Panel (TODO)</div>} />
          <Route path="system-logs" element={<div>System Logs (TODO)</div>} />
          <Route path="backup" element={<div>Backup Management (TODO)</div>} />
        </Route>
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
