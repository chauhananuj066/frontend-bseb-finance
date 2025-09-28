import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

import { usePaymentSummary } from '../../hooks/api/useDashbaord';
import { formatCurrency, formatPercentage } from '@utils/helpers/formatHelpers';

const PaymentSummary = () => {
  const { data: summaryData, isLoading, error } = usePaymentSummary();

  // Mock data for development
  const mockSummary = {
    totalPaid: 12500000,
    totalPending: 3200000,
    totalOverdue: 850000,
    paymentMethods: {
      bank_transfer: { amount: 8500000, count: 45, percentage: 68 },
      cheque: { amount: 2800000, count: 23, percentage: 22.4 },
      online: { amount: 1200000, count: 18, percentage: 9.6 },
    },
    monthlyComparison: {
      paid: { current: 12500000, previous: 11200000, change: 11.6 },
      pending: { current: 3200000, previous: 2800000, change: 14.3 },
      overdue: { current: 850000, previous: 950000, change: -10.5 },
    },
  };

  const summary = summaryData?.success ? summaryData.data : mockSummary;

  const getChangeIcon = (change) => {
    if (change > 0) return <FaArrowUp className="text-success" />;
    if (change < 0) return <FaArrowDown className="text-danger" />;
    return <FaMinus className="text-muted" />;
  };

  const getChangeColor = (change, inverse = false) => {
    if (change > 0) return inverse ? 'text-danger' : 'text-success';
    if (change < 0) return inverse ? 'text-success' : 'text-danger';
    return 'text-muted';
  };

  if (error) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">Payment Summary</h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-warning mb-0">
            Unable to load payment summary. Please try again.
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="h-100 payment-summary-card">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <span className="me-2">💳</span>
            Payment Summary
          </h5>
        </Card.Header>

        <Card.Body>
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: '200px' }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Status Overview */}
              <Row className="g-3 mb-4">
                <Col md={4}>
                  <div className="payment-status-item p-3 bg-success bg-opacity-10 rounded">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-success mb-0">Paid</h6>
                      <span
                        className={`small ${getChangeColor(summary.monthlyComparison.paid.change)}`}
                      >
                        {getChangeIcon(summary.monthlyComparison.paid.change)}
                        {formatPercentage(Math.abs(summary.monthlyComparison.paid.change))}
                      </span>
                    </div>
                    <div className="fs-5 fw-bold text-success">
                      {formatCurrency(summary.totalPaid)}
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="payment-status-item p-3 bg-warning bg-opacity-10 rounded">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-warning mb-0">Pending</h6>
                      <span
                        className={`small ${getChangeColor(summary.monthlyComparison.pending.change, true)}`}
                      >
                        {getChangeIcon(summary.monthlyComparison.pending.change)}
                        {formatPercentage(Math.abs(summary.monthlyComparison.pending.change))}
                      </span>
                    </div>
                    <div className="fs-5 fw-bold text-warning">
                      {formatCurrency(summary.totalPending)}
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="payment-status-item p-3 bg-danger bg-opacity-10 rounded">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-danger mb-0">Overdue</h6>
                      <span
                        className={`small ${getChangeColor(summary.monthlyComparison.overdue.change, true)}`}
                      >
                        {getChangeIcon(summary.monthlyComparison.overdue.change)}
                        {formatPercentage(Math.abs(summary.monthlyComparison.overdue.change))}
                      </span>
                    </div>
                    <div className="fs-5 fw-bold text-danger">
                      {formatCurrency(summary.totalOverdue)}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Payment Methods */}
              <div>
                <h6 className="mb-3">Payment Methods Distribution</h6>
                {Object.entries(summary.paymentMethods).map(([method, data], index) => (
                  <motion.div
                    key={method}
                    className="mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-capitalize fw-medium">
                        {method.replace('_', ' ')}
                        <small className="text-muted ms-1">({data.count} transactions)</small>
                      </span>
                      <span className="fw-semibold">
                        {formatCurrency(data.amount)} ({formatPercentage(data.percentage)})
                      </span>
                    </div>
                    <ProgressBar
                      now={data.percentage}
                      className="progress-sm"
                      variant={
                        method === 'bank_transfer'
                          ? 'primary'
                          : method === 'cheque'
                            ? 'info'
                            : 'success'
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default PaymentSummary;
