import React, { useState, useEffect } from 'react';
import { Nav, Collapse, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaFileInvoice,
  FaCreditCard,
  FaClipboardList,
  FaUserTie,
  FaChartBar,
  FaCogs,
  FaQuestionCircle,
  FaAngleDown,
  FaAngleRight,
  FaBell,
  FaCalendar,
  FaFolder,
} from 'react-icons/fa';

// Store actions
import { toggleSidebar, setSidebarCollapsed } from '@store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  // State for submenu toggles
  const [openMenus, setOpenMenus] = useState({});

  // Navigation menu structure
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <FaTachometerAlt />,
      path: '/dashboard',
      badge: null,
    },
    {
      title: 'Users',
      icon: <FaUsers />,
      path: '/users',
      badge: null,
      submenu: [
        { title: 'All Users', path: '/users' },
        { title: 'Create User', path: '/users/create' },
        { title: 'User Roles', path: '/users/roles' },
      ],
    },
    {
      title: 'Departments',
      icon: <FaBuilding />,
      path: '/departments',
      badge: null,
    },
    {
      title: 'Invoices',
      icon: <FaFileInvoice />,
      path: '/invoices',
      badge: { count: 12, variant: 'warning' },
      submenu: [
        { title: 'All Invoices', path: '/invoices' },
        { title: 'Pending Approval', path: '/invoices/pending' },
        { title: 'Approved', path: '/invoices/approved' },
        { title: 'Create Invoice', path: '/invoices/create' },
      ],
    },
    {
      title: 'Payments',
      icon: <FaCreditCard />,
      path: '/payments',
      badge: { count: 5, variant: 'success' },
      submenu: [
        { title: 'All Payments', path: '/payments' },
        { title: 'Pending Payments', path: '/payments/pending' },
        { title: 'Payment History', path: '/payments/history' },
      ],
    },
    {
      title: 'Work Orders',
      icon: <FaClipboardList />,
      path: '/workorders',
      badge: null,
      submenu: [
        { title: 'Active Orders', path: '/workorders/active' },
        { title: 'Completed Orders', path: '/workorders/completed' },
        { title: 'Create Order', path: '/workorders/create' },
      ],
    },
    {
      title: 'Vendors',
      icon: <FaUserTie />,
      path: '/vendors',
      badge: null,
    },
    {
      title: 'Reports',
      icon: <FaChartBar />,
      path: '/reports',
      badge: null,
      submenu: [
        { title: 'Financial Reports', path: '/reports/financial' },
        { title: 'Department Reports', path: '/reports/departments' },
        { title: 'User Activity', path: '/reports/activity' },
        { title: 'Custom Reports', path: '/reports/custom' },
      ],
    },
  ];

  // Admin only menu items
  const adminMenuItems = [
    {
      title: 'Settings',
      icon: <FaCogs />,
      path: '/settings',
      badge: null,
      submenu: [
        { title: 'System Settings', path: '/settings/system' },
        { title: 'User Permissions', path: '/settings/permissions' },
        { title: 'Email Templates', path: '/settings/email' },
        { title: 'Backup & Restore', path: '/settings/backup' },
      ],
    },
  ];

  // Quick access items
  const quickAccessItems = [
    { title: 'Calendar', icon: <FaCalendar />, path: '/calendar' },
    { title: 'Documents', icon: <FaFolder />, path: '/documents' },
    { title: 'Notifications', icon: <FaBell />, path: '/notifications' },
    { title: 'Help Center', icon: <FaQuestionCircle />, path: '/help' },
  ];

  // Check if current path matches menu item
  const isActiveRoute = (path, submenu = null) => {
    if (submenu) {
      return submenu.some((item) => location.pathname === item.path);
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Toggle submenu
  const toggleSubmenu = (menuTitle) => {
    if (sidebarCollapsed) return;

    setOpenMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      dispatch(setSidebarCollapsed(true));
    }
  };

  // Auto-expand active menu on load
  useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.submenu && isActiveRoute(item.path, item.submenu)) {
        setOpenMenus((prev) => ({ ...prev, [item.title]: true }));
      }
    });
  }, [location.pathname]);

  // Close all submenus when sidebar collapses
  useEffect(() => {
    if (sidebarCollapsed) {
      setOpenMenus({});
    }
  }, [sidebarCollapsed]);

  const renderMenuItem = (item, isAdmin = false) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = isActiveRoute(item.path, item.submenu);
    const isSubmenuOpen = openMenus[item.title];

    return (
      <li key={item.title} className="nav-item">
        <div
          className={`nav-link ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`}
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.title);
            } else {
              handleNavigation(item.path);
            }
          }}
          role="button"
        >
          <div className="nav-link-content">
            <span className="nav-icon">{item.icon}</span>

            {!sidebarCollapsed && (
              <>
                <span className="nav-text">{item.title}</span>

                {/* Badge */}
                {item.badge && (
                  <Badge bg={item.badge.variant} className="nav-badge ms-auto">
                    {item.badge.count}
                  </Badge>
                )}

                {/* Submenu Arrow */}
                {hasSubmenu && (
                  <span className="nav-arrow ms-auto">
                    {isSubmenuOpen ? <FaAngleDown /> : <FaAngleRight />}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Submenu */}
        {hasSubmenu && !sidebarCollapsed && (
          <Collapse in={isSubmenuOpen}>
            <ul className="nav-submenu">
              {item.submenu.map((subItem) => (
                <li key={subItem.path} className="nav-subitem">
                  <div
                    className={`nav-sublink ${location.pathname === subItem.path ? 'active' : ''}`}
                    onClick={() => handleNavigation(subItem.path)}
                    role="button"
                  >
                    {subItem.title}
                  </div>
                </li>
              ))}
            </ul>
          </Collapse>
        )}
      </li>
    );
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} theme-${theme}`}>
      <div className="sidebar-content">
        {/* Logo Section */}
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <div className="sidebar-logo">
              <img src="/assets/images/logos/bseb-logo.png" alt="BSEB" className="logo-img" />
              <span className="logo-text">BSEB Finance</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {/* Main Navigation */}
            {navigationItems.map((item) => renderMenuItem(item))}

            {/* Admin Only Section */}
            {user?.role === 'admin' && (
              <>
                {!sidebarCollapsed && (
                  <li className="nav-divider">
                    <span className="nav-divider-text">Administration</span>
                  </li>
                )}
                {adminMenuItems.map((item) => renderMenuItem(item, true))}
              </>
            )}

            {/* Quick Access Section */}
            {!sidebarCollapsed && (
              <li className="nav-divider">
                <span className="nav-divider-text">Quick Access</span>
              </li>
            )}
            {quickAccessItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>

        {/* User Info Footer */}
        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-info-card">
              <div className="user-avatar">
                <img
                  src={user?.avatar || '/assets/images/avatars/bseb-logo.png'}
                  alt={user?.username}
                  className="user-avatar-img"
                />
              </div>
              <div className="user-details">
                <div className="user-name">{user?.username}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Toggle Button (for mobile) */}
      <button
        className="sidebar-toggle d-md-none"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle Sidebar"
      >
        <FaAngleRight className={`toggle-icon ${!sidebarCollapsed ? 'rotated' : ''}`} />
      </button>
    </aside>
  );
};

export default Sidebar;
