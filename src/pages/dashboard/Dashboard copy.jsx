import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Components
import DashboardStats from '@/pages/dashboard/DashboardStats';
import RecentInvoices from '@/pages/dashboard/RecentInvoices';
import PendingApprovals from '@/pages/dashboard/PendingApprovals';
import RevenueChart from '@/pages/dashboard/RevenueChart';
import PaymentSummary from '@/pages/dashboard/PaymentSummary';

// Styles
import './Dashboard.scss';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Set page title
    document.title = 'Dashboard - BSEB Finance Management';
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <motion.div
        className="dashboard-header mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title mb-1">
              {getGreeting()}, {user?.username}! 👋
            </h1>
            <p className="page-subtitle text-muted mb-0">
              Here's what's happening with your finance operations today.
            </p>
          </div>
          <div className="dashboard-actions">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">📊 Generate Report</button>
              <button className="btn btn-primary btn-sm">➕ Quick Actions</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Dashboard Content */}
      <Row className="g-4">
        {/* Left Column */}
        <Col lg={8}>
          <Row className="g-4">
            {/* Revenue Chart */}
            <Col md={12}>
              <RevenueChart />
            </Col>

            {/* Recent Invoices */}
            <Col md={12}>
              <RecentInvoices />
            </Col>
          </Row>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          <Row className="g-4">
            {/* Pending Approvals */}
            <Col md={12}>
              <PendingApprovals />
            </Col>

            {/* Payment Summary */}
            <Col md={12}>
              <PaymentSummary />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Quick Actions Section */}
      <motion.div
        className="quick-actions-section mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="mb-3">⚡ Quick Actions</h5>
            <Row className="g-3">
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded">
                  <div className="quick-action-icon mb-2">📄</div>
                  <h6 className="mb-1">New Invoice</h6>
                  <small className="text-muted">Create invoice</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded">
                  <div className="quick-action-icon mb-2">💳</div>
                  <h6 className="mb-1">Process Payment</h6>
                  <small className="text-muted">Make payment</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded">
                  <div className="quick-action-icon mb-2">👥</div>
                  <h6 className="mb-1">Add Vendor</h6>
                  <small className="text-muted">Register vendor</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded">
                  <div className="quick-action-icon mb-2">🔧</div>
                  <h6 className="mb-1">Work Order</h6>
                  <small className="text-muted">Create work order</small>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
