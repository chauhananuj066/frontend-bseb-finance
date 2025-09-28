import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';

// Components
import TopNavbar from '@components/common/Navigation/TopNavbar';
import Sidebar from '@components/common/Navigation/Sidebar';
//import ProtectedRoute from '@components/common/ProtectedRoute/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Utils
import { config } from '@config/environment';

const AdminLayout = () => {
  const { sidebarCollapsed = false, theme = 'light' } = useSelector((state) => state.ui || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set theme class on body
    document.body.className = `theme-${theme}`;
    document.body.setAttribute('data-sidebar-collapsed', sidebarCollapsed);

    // Add admin layout class
    document.body.classList.add('admin-layout-body');

    return () => {
      document.body.classList.remove('admin-layout-body');
    };
  }, [theme, sidebarCollapsed]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile: collapse sidebar by default
        if (!sidebarCollapsed) {
          // dispatch({ type: 'ui/setSidebarCollapsed', payload: true });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, sidebarCollapsed]);

  return (
    <>
      {/* <ProtectedRoute> */}
      <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? 'var(--bs-dark)' : 'var(--bs-white)',
              color: theme === 'dark' ? 'var(--bs-light)' : 'var(--bs-dark)',
              border: `1px solid ${theme === 'dark' ? 'var(--bs-gray-700)' : 'var(--bs-gray-200)'}`,
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: 'var(--bs-success)',
                secondary: theme === 'dark' ? 'var(--bs-dark)' : 'var(--bs-white)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--bs-danger)',
                secondary: theme === 'dark' ? 'var(--bs-dark)' : 'var(--bs-white)',
              },
            },
            loading: {
              iconTheme: {
                primary: 'var(--bs-primary)',
                secondary: theme === 'dark' ? 'var(--bs-dark)' : 'var(--bs-white)',
              },
            },
          }}
        />

        {/* Top Navigation */}
        <TopNavbar />

        <div className="layout-wrapper">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Content Container */}
            <div className="content-container">
              <Container fluid className="content-inner p-4">
                <form action=""></form> {/* Breadcrumb could go here */}
                <div className="page-content">
                  <Outlet />
                </div>
              </Container>
            </div>

            {/* Footer */}
            <footer className="main-footer">
              <Container fluid className="px-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="footer-text">
                    <small className="text-muted">
                      © 2024 BSEB Finance System. All rights reserved.
                    </small>
                  </div>
                  <div className="footer-links">
                    <small className="text-muted">Version {config?.app?.version || '1.0.0'}</small>
                  </div>
                </div>
              </Container>
            </footer>
          </main>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {!sidebarCollapsed && (
          <div
            className="sidebar-overlay d-md-none"
            // onClick={() => dispatch({ type: 'ui/setSidebarCollapsed', payload: true })}
          />
        )}
      </div>
    </>
  );
};

export default AdminLayout;
