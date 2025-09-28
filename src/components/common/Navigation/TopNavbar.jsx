import React from 'react';
import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaUser, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

// Store actions
import { toggleSidebar, setTheme } from '@store/slices/uiSlice';
import { logoutAsync } from '@store/slices/authSlice';

// Components
import Button from '@components/common/UI/Button/Button';

const TopNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const notifications = []; // Hardcode empty array temporarily

  const { theme } = useSelector((state) => state.ui);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  const unreadNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;
  return (
    <Navbar bg="white" className="top-navbar border-bottom px-3 py-2" fixed="top">
      <div className="d-flex align-items-center">
        {/* Sidebar Toggle */}
        <Button
          variant="outline-secondary"
          size="sm"
          icon={<FaBars />}
          className="me-3"
          onClick={() => dispatch(toggleSidebar())}
        />

        {/* Logo */}
        <Navbar.Brand href="/dashboard" className="d-flex align-items-center">
          <img
            src="/assets/images/logos/bseb-logo.png"
            alt="BSEB"
            width="32"
            height="32"
            className="me-2"
          />
          <span className="fw-bold text-primary d-none d-md-inline">BSEB Finance</span>
        </Navbar.Brand>
      </div>

      <Nav className="ms-auto d-flex align-items-center">
        {/* Theme Toggle */}
        <Button
          variant="outline-secondary"
          size="sm"
          icon={theme === 'light' ? <FaMoon /> : <FaSun />}
          className="me-2"
          onClick={handleThemeToggle}
        />

        {/* Notifications */}
        <Dropdown className="me-2">
          <Dropdown.Toggle as="div" className="nav-item-custom">
            <Button
              variant="outline-secondary"
              size="sm"
              icon={<FaBell />}
              className="position-relative"
            >
              {unreadNotifications > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle badge-sm"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className="notification-dropdown">
            <Dropdown.Header>Notifications ({unreadNotifications} unread)</Dropdown.Header>
            <Dropdown.Divider />

            {notifications.length === 0 ? (
              <Dropdown.Item disabled>No notifications</Dropdown.Item>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <Dropdown.Item key={notification.id} className="notification-item">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{notification.title}</div>
                      <small className="text-muted">{notification.message}</small>
                    </div>
                    {!notification.read && <div className="notification-badge"></div>}
                  </div>
                </Dropdown.Item>
              ))
            )}

            <Dropdown.Divider />
            <Dropdown.Item href="/notifications" className="text-center">
              View All Notifications
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* User Menu */}
        <Dropdown>
          <Dropdown.Toggle as="div" className="nav-item-custom">
            <div className="user-avatar d-flex align-items-center">
              <div className="avatar-img me-2">
                <img
                  src={user?.avatar || '/assets/images/avatars/bseb-logo.png'}
                  alt={user?.username}
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              </div>
              <div className="user-info d-none d-md-block">
                <div className="fw-semibold">{user?.username}</div>
                <small className="text-muted">{user?.role}</small>
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Header>
              {user?.username}
              <br />
              <small className="text-muted">{user?.email}</small>
            </Dropdown.Header>
            <Dropdown.Divider />

            <Dropdown.Item href="/profile">
              <FaUser className="me-2" />
              Profile
            </Dropdown.Item>

            <Dropdown.Item href="/settings">
              <FaCog className="me-2" />
              Settings
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleLogout} className="text-danger">
              <FaSignOutAlt className="me-2" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;
