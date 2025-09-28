import React from 'react';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-white)',
            color: 'var(--color-gray-800)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />

      {children}
    </div>
  );
};

export default AuthLayout;
