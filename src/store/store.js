// store/store.js
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
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { sessionManager, api } from '../services/api/client'; // Persist configuration
const persistConfig = {
  key: 'bseb-ifms-root',
  storage,
  whitelist: ['auth'], // ui ko persist nahi karna, sirf auth

  transforms: [
    // Custom transform to handle session expiry
    {
      in: (inboundState, key) => {
        if (key === 'auth' && sessionManager.isExpired()) {
          return {
            ...inboundState,
            isAuthenticated: false,
            user: null,
            sessionId: null,
          };
        }
        return inboundState;
      },
      out: (outboundState, key) => {
        return outboundState;
      },
    },
  ],
};

// Root reducer - Yahan future mein aur reducers add kar sakte ho
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer, // ✅ Add this line
  // invoices: invoicesReducer,  // Future mein add kar sakte ho
  // users: usersReducer,        // Future mein add kar sakte ho
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV, // Development mein Redux DevTools enable
});

export const persistor = persistStore(store);

// Auto-restore session on app start
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.isAuthenticated && !sessionManager.isExpired()) {
    api.refreshSession(); // sessionManager.refreshSession() ki jagah
  }
});

export default store;
