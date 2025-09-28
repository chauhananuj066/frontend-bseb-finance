import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaClipboardList,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaChartBar,
  FaCog,
  FaChevronLeft,
} from 'react-icons/fa';

import './Sidebar.scss';

const Sidebar = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      roles: ['admin', 'manager', 'accountant', 'clerk'],
    },
    {
      path: '/invoices',
      icon: FaFileInvoiceDollar,
      label: 'Invoices',
      roles: ['admin', 'manager', 'accountant', 'clerk'],
    },
    {
      path: '/payments',
      icon: FaMoneyBillWave,
      label: 'Payments',
      roles: ['admin', 'manager', 'accountant'],
    },
    {
      path: '/work-orders',
      icon: FaClipboardList,
      label: 'Work Orders',
      roles: ['admin', 'manager', 'clerk'],
    },
    {
      path: '/vendors',
      icon: FaUserTie,
      label: 'Vendors',
      roles: ['admin', 'manager'],
    },
    {
      path: '/users',
      icon: FaUsers,
      label: 'Users',
      roles: ['admin', 'manager'],
    },
    {
      path: '/departments',
      icon: FaBuilding,
      label: 'Departments',
      roles: ['admin'],
    },
    {
      path: '/reports',
      icon: FaChartBar,
      label: 'Reports',
      roles: ['admin', 'manager', 'accountant'],
    },
    {
      path: '/settings',
      icon: FaCog,
      label: 'Settings',
      roles: ['admin', 'manager'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role));

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-content">
        <Nav className="sidebar-nav flex-column">
          <AnimatePresence>
            {filteredMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-link-content">
                      <span className="nav-icon">
                        <Icon />
                      </span>
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            className="nav-label"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {isActive && (
                      <motion.div
                        className="active-indicator"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Nav.Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
