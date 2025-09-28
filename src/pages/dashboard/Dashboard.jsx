import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  FaRupeeSign,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Styles
import './Dashboard.scss';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Dashboard - BSEB Finance Management';
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Static data
  const dashboardStats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,67,890',
      change: '+12.5%',
      changeType: 'increase',
      icon: <FaRupeeSign />,
      color: 'success',
    },
    {
      title: 'Pending Invoices',
      value: '47',
      change: '-8.2%',
      changeType: 'decrease',
      icon: <FaFileInvoiceDollar />,
      color: 'warning',
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '+5.1%',
      changeType: 'increase',
      icon: <FaClock />,
      color: 'info',
    },
    {
      title: 'Completed Tasks',
      value: '156',
      change: '+18.7%',
      changeType: 'increase',
      icon: <FaCheckCircle />,
      color: 'success',
    },
  ];

  const recentInvoices = [
    {
      id: 'INV-2024-001',
      vendor: 'Bihar Electrical Supplies',
      amount: '₹1,25,000',
      status: 'Paid',
      date: '2024-09-25',
    },
    {
      id: 'INV-2024-002',
      vendor: 'Patna Infrastructure Ltd',
      amount: '₹3,45,670',
      status: 'Pending',
      date: '2024-09-24',
    },
    {
      id: 'INV-2024-003',
      vendor: 'Technical Services Co.',
      amount: '₹89,500',
      status: 'Approved',
      date: '2024-09-23',
    },
    {
      id: 'INV-2024-004',
      vendor: 'Office Equipment House',
      amount: '₹67,800',
      status: 'Pending',
      date: '2024-09-22',
    },
    {
      id: 'INV-2024-005',
      vendor: 'Maintenance Services',
      amount: '₹45,200',
      status: 'Paid',
      date: '2024-09-21',
    },
  ];

  const pendingApprovals = [
    {
      id: 'WO-2024-015',
      title: 'Electrical Maintenance Work',
      department: 'Infrastructure',
      amount: '₹2,45,000',
      priority: 'High',
    },
    {
      id: 'PO-2024-032',
      title: 'Office Supplies Purchase',
      department: 'Administration',
      amount: '₹45,600',
      priority: 'Medium',
    },
    {
      id: 'REP-2024-008',
      title: 'Monthly Financial Report',
      department: 'Finance',
      amount: '₹0',
      priority: 'Low',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'badge bg-success';
      case 'Approved':
        return 'badge bg-info';
      case 'Pending':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge bg-danger';
      case 'Medium':
        return 'badge bg-warning';
      case 'Low':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
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
              {getGreeting()}, {user?.role || ''}! 👋
            </h1>
            <p className="page-subtitle text-muted mb-0">
              Here's what's happening with your finance operations today.
            </p>
          </div>
          <div className="dashboard-actions">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <FaChartLine className="me-1" />
                Generate Report
              </button>
              <button className="btn btn-primary btn-sm">➕ Quick Actions</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Stats */}
      <Row className="g-4 mb-4">
        {dashboardStats.map((stat, index) => (
          <Col key={index} lg={3} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1">{stat.title}</p>
                      <h3 className="fw-bold mb-0">{stat.value}</h3>
                      <small
                        className={`text-${stat.changeType === 'increase' ? 'success' : 'danger'}`}
                      >
                        {stat.changeType === 'increase' ? <FaArrowUp /> : <FaArrowDown />}{' '}
                        {stat.change} from last month
                      </small>
                    </div>
                    <div className={`stat-icon bg-${stat.color}`}>{stat.icon}</div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Main Dashboard Content */}
      <Row className="g-4">
        {/* Left Column */}
        <Col lg={8}>
          <Row className="g-4">
            {/* Revenue Chart Placeholder */}
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Revenue Overview</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="chart-placeholder text-center py-5">
                      <FaChartLine size={48} className="text-muted mb-3" />
                      <h6 className="text-muted">Revenue Chart</h6>
                      <p className="text-muted small">Chart visualization would go here</p>

                      {/* Sample progress bars to simulate chart */}
                      <div className="mt-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Q1 2024</span>
                          <span>₹45,67,890</span>
                        </div>
                        <ProgressBar variant="success" now={75} className="mb-3" />

                        <div className="d-flex justify-content-between mb-2">
                          <span>Q2 2024</span>
                          <span>₹52,34,560</span>
                        </div>
                        <ProgressBar variant="info" now={85} className="mb-3" />

                        <div className="d-flex justify-content-between mb-2">
                          <span>Q3 2024</span>
                          <span>₹48,91,230</span>
                        </div>
                        <ProgressBar variant="warning" now={80} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Recent Invoices */}
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Invoices</h5>
                    <button className="btn btn-outline-primary btn-sm">View All</button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Invoice ID</th>
                          <th>Vendor</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentInvoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="fw-semibold">{invoice.id}</td>
                            <td>{invoice.vendor}</td>
                            <td className="fw-semibold">{invoice.amount}</td>
                            <td>
                              <span className={getStatusBadge(invoice.status)}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="text-muted">{invoice.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          <Row className="g-4">
            {/* Pending Approvals */}
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Pending Approvals</h5>
                    <span className="badge bg-warning">{pendingApprovals.length}</span>
                  </Card.Header>
                  <Card.Body>
                    {pendingApprovals.map((item, index) => (
                      <div
                        key={item.id}
                        className={`approval-item ${index !== pendingApprovals.length - 1 ? 'border-bottom' : ''} pb-3 mb-3`}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{item.title}</h6>
                            <small className="text-muted">
                              {item.id} • {item.department}
                            </small>
                            <div className="mt-1">
                              <span className="fw-semibold">{item.amount}</span>
                              <span className={`ms-2 ${getPriorityBadge(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                          <FaExclamationTriangle className="text-warning" />
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-primary btn-sm w-100 mt-2">
                      View All Approvals
                    </button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Payment Summary */}
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Payment Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="payment-summary">
                      <div className="summary-item d-flex justify-content-between mb-3">
                        <span className="text-muted">Total Paid This Month</span>
                        <span className="fw-semibold text-success">₹12,45,670</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between mb-3">
                        <span className="text-muted">Pending Payments</span>
                        <span className="fw-semibold text-warning">₹5,67,890</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between mb-3">
                        <span className="text-muted">Overdue Payments</span>
                        <span className="fw-semibold text-danger">₹1,23,450</span>
                      </div>
                      <hr />
                      <div className="summary-item d-flex justify-content-between">
                        <span className="fw-semibold">Total Outstanding</span>
                        <span className="fw-bold">₹6,91,340</span>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm w-100 mt-3">
                      Payment Details
                    </button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Quick Actions Section */}
      <motion.div
        className="quick-actions-section mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <Card>
          <Card.Body>
            <h5 className="mb-3">⚡ Quick Actions</h5>
            <Row className="g-3">
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded cursor-pointer hover-shadow">
                  <div className="quick-action-icon mb-2">📄</div>
                  <h6 className="mb-1">New Invoice</h6>
                  <small className="text-muted">Create invoice</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded cursor-pointer hover-shadow">
                  <div className="quick-action-icon mb-2">💳</div>
                  <h6 className="mb-1">Process Payment</h6>
                  <small className="text-muted">Make payment</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded cursor-pointer hover-shadow">
                  <div className="quick-action-icon mb-2">👥</div>
                  <h6 className="mb-1">Add Vendor</h6>
                  <small className="text-muted">Register vendor</small>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="quick-action-card text-center p-3 border rounded cursor-pointer hover-shadow">
                  <div className="quick-action-icon mb-2">🔧</div>
                  <h6 className="mb-1">Work Order</h6>
                  <small className="text-muted">Create work order</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
