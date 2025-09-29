// store/store.js - Enhanced Redux Store
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Existing slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

// New slices for Vendor Payment Module
import workOrderReducer from './slices/workOrderSlice';
import invoiceReducer from './slices/invoiceSlice';
import vendorReducer from './slices/vendorSlice';
import departmentReducer from './slices/departmentSlice';

import { sessionManager } from '@/services/api/client';

// Enhanced persist configuration
const persistConfig = {
  key: 'bseb-ifms-root',
  storage,
  whitelist: ['auth'], // Only persist authentication state
  transforms: [
    {
      in: (inboundState, key) => {
        if (key === 'auth' && sessionManager.isExpired()) {
          console.warn('Session expired during rehydration, clearing auth state');
          return {
            ...inboundState,
            isAuthenticated: false,
            user: null,
            sessionId: null,
            permissions: [],
          };
        }
        return inboundState;
      },
      out: (outboundState, key) => outboundState,
    },
  ],
};

// Enhanced root reducer with vendor payment modules
const rootReducer = combineReducers({
  // Core modules
  auth: authReducer,
  ui: uiReducer,

  // Vendor Payment Module
  workOrders: workOrderReducer,
  invoices: invoiceReducer,
  vendors: vendorReducer,
  departments: departmentReducer,

  // Future modules (commented for now)
  // employees: employeeReducer,
  // grants: grantReducer,
  // reports: reportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Enhanced store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['register'],
      },
    }),
  devTools: import.meta.env.DEV
    ? {
        name: 'BSEB IFMS Store',
        trace: true,
        traceLimit: 25,
      }
    : false,
});

export const persistor = persistStore(store);

// Enhanced session monitoring
store.subscribe(() => {
  const state = store.getState();

  if (state.auth.isAuthenticated) {
    if (sessionManager.isExpired()) {
      console.warn('Session expired, dispatching logout');
      store.dispatch({ type: 'auth/logout' });
    } else {
      // Update last activity timestamp
      sessionManager.set('bseb_last_activity', Date.now());
    }
  }
});

export default store;
