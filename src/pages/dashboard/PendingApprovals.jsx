import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaClock, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { usePendingApprovals } from '../../hooks/api/useDashbaord';
import { formatCurrency, formatDate } from '@utils/helpers/formatHelpers';

const PendingApprovals = () => {
  const { data: approvalsData, isLoading, error } = usePendingApprovals();

  // Mock data for development
  const mockApprovals = [
    {
      id: 1,
      type: 'invoice',
      title: 'Invoice INV-2024-006',
      description: 'Electrical Equipment Purchase',
      amount: 450000,
      submittedBy: 'John Doe',
      submittedAt: '2024-01-10T10:30:00Z',
      priority: 'high',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Request',
      description: 'Monthly Contractor Payment',
      amount: 125000,
      submittedBy: 'Jane Smith',
      submittedAt: '2024-01-09T14:15:00Z',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'work_order',
      title: 'Work Order WO-2024-12',
      description: 'Substation Maintenance',
      amount: 75000,
      submittedBy: 'Mike Johnson',
      submittedAt: '2024-01-08T09:45:00Z',
      priority: 'low',
    },
    {
      id: 4,
      type: 'invoice',
      title: 'Invoice INV-2024-007',
      description: 'Software License Renewal',
      amount: 200000,
      submittedBy: 'Sarah Wilson',
      submittedAt: '2024-01-07T16:20:00Z',
      priority: 'medium',
    },
  ];

  const approvals = approvalsData?.success ? approvalsData.data : mockApprovals;

  const getPriorityBadge = (priority) => {
    const config = {
      high: { variant: 'danger', text: 'High Priority' },
      medium: { variant: 'warning', text: 'Medium Priority' },
      low: { variant: 'info', text: 'Low Priority' },
    };
    const priorityConfig = config[priority] || config.medium;
    return (
      <Badge bg={priorityConfig.variant} className="ms-2">
        {priorityConfig.text}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      invoice: '📄',
      payment: '💳',
      work_order: '🔧',
    };
    return icons[type] || '📋';
  };

  if (error) {
    return (
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Pending Approvals</h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-warning mb-0">
            Unable to load pending approvals. Please try again.
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-100 pending-approvals-card">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <span className="me-2">⏳</span>
            Pending Approvals
            <Badge bg="warning" className="ms-2">
              {approvals.length}
            </Badge>
          </h5>
          <Link to="/approvals" className="btn btn-outline-primary btn-sm">
            View All
            <FaArrowRight className="ms-1" />
          </Link>
        </Card.Header>

        <Card.Body className="p-0">
          {isLoading ? (
            <div className="p-4">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : approvals.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <FaCheck className="mb-2" size={24} />
              <p className="mb-0">No pending approvals</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {approvals.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListGroup.Item className="border-0 py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className="me-2">{getTypeIcon(approval.type)}</span>
                          <h6 className="mb-0 fw-semibold">{approval.title}</h6>
                          {getPriorityBadge(approval.priority)}
                        </div>
                        <p className="mb-2 text-muted small">{approval.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-semibold text-success">
                              {formatCurrency(approval.amount)}
                            </span>
                            <div className="small text-muted">
                              by {approval.submittedBy} •{' '}
                              {formatDate(approval.submittedAt, 'relative')}
                            </div>
                          </div>
                          <div className="btn-group btn-group-sm">
                            <Button variant="outline-success" size="sm" title="Approve">
                              <FaCheck />
                            </Button>
                            <Button variant="outline-danger" size="sm" title="Reject">
                              <FaTimes />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                </motion.div>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default PendingApprovals;
