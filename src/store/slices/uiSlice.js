// store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Sidebar state
    sidebarCollapsed: false,
    sidebarVisible: true,

    // Theme state
    theme: 'light', // 'light' | 'dark'

    // Layout preferences
    layoutMode: 'default', // 'default' | 'compact' | 'expanded'

    // Mobile responsiveness
    isMobile: false,

    // Loading states
    pageLoading: false,

    // Notification settings
    notifications: {
      enabled: true,
      position: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
      duration: 4000,
    },

    // Modal states
    modals: {},

    // Breadcrumb
    breadcrumbs: [],
  },

  reducers: {
    // Sidebar actions
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarVisible: (state, action) => {
      state.sidebarVisible = action.payload;
    },

    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Layout actions
    setLayoutMode: (state, action) => {
      state.layoutMode = action.payload;
    },

    // Mobile detection
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      // Auto-collapse sidebar on mobile
      if (action.payload && !state.sidebarCollapsed) {
        state.sidebarCollapsed = true;
      }
    },

    // Loading states
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },

    // Notification settings
    updateNotificationSettings: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },

    // Modal management
    openModal: (state, action) => {
      const { modalId, props = {} } = action.payload;
      state.modals[modalId] = {
        isOpen: true,
        props,
      };
    },

    closeModal: (state, action) => {
      const modalId = action.payload;
      if (state.modals[modalId]) {
        state.modals[modalId].isOpen = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modalId) => {
        state.modals[modalId].isOpen = false;
      });
    },

    // Breadcrumb management
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },

    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },

    removeBreadcrumb: (state, action) => {
      const index = action.payload;
      state.breadcrumbs.splice(index, 1);
    },

    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    // Reset UI state (useful for logout)
    resetUIState: (state) => {
      return {
        ...state,
        sidebarCollapsed: false,
        modals: {},
        breadcrumbs: [],
        pageLoading: false,
      };
    },

    // Bulk UI preferences update
    updateUIPreferences: (state, action) => {
      const { theme, sidebarCollapsed, layoutMode, notifications } = action.payload;

      if (theme !== undefined) state.theme = theme;
      if (sidebarCollapsed !== undefined) state.sidebarCollapsed = sidebarCollapsed;
      if (layoutMode !== undefined) state.layoutMode = layoutMode;
      if (notifications !== undefined) {
        state.notifications = { ...state.notifications, ...notifications };
      }
    },
  },
});

// Export actions
export const {
  setSidebarCollapsed,
  toggleSidebar,
  setSidebarVisible,
  setTheme,
  toggleTheme,
  setLayoutMode,
  setIsMobile,
  setPageLoading,
  updateNotificationSettings,
  openModal,
  closeModal,
  closeAllModals,
  setBreadcrumbs,
  addBreadcrumb,
  removeBreadcrumb,
  clearBreadcrumbs,
  resetUIState,
  updateUIPreferences,
} = uiSlice.actions;

// Selectors for performance optimization
export const selectUI = (state) => state.ui;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectTheme = (state) => state.ui.theme;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectPageLoading = (state) => state.ui.pageLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;

// Computed selectors
export const selectModalState = (modalId) => (state) =>
  state.ui.modals[modalId] || { isOpen: false, props: {} };

export const selectThemeClass = (state) => `theme-${state.ui.theme}`;

export const selectLayoutClasses = (state) => {
  const { sidebarCollapsed, theme, layoutMode } = state.ui;
  return {
    'sidebar-collapsed': sidebarCollapsed,
    [`theme-${theme}`]: true,
    [`layout-${layoutMode}`]: true,
  };
};

export default uiSlice.reducer;
