import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';

// Security check for token expiry
import { getToken, removeToken } from '@services/api/client';
import { logoutAsync } from '@store/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check token expiry on app load
    const checkTokenExpiry = () => {
      const token = getToken();
      if (token) {
        try {
          // Decode JWT token to check expiry
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;

          if (payload.exp < currentTime) {
            // Token expired
            removeToken();
            dispatch(logoutAsync());
          }
        } catch (error) {
          // Invalid token
          removeToken();
          dispatch(logoutAsync());
        }
      }
    };

    checkTokenExpiry();

    // Check token expiry every 5 minutes
    const tokenCheckInterval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(tokenCheckInterval);
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
