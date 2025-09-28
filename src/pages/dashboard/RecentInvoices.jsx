import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useRecentInvoices } from '../../hooks/api/useDashbaord';
import { formatCurrency, formatDate } from '@utils/helpers/formatHelpers';
import { INVOICE_STATUS } from '@utils/constants';

const RecentInvoices = () => {
  const { data: invoicesData, isLoading, error } = useRecentInvoices(5);

  // Mock data for development
  const mockInvoices = [
    {
      id: 1,
      invoice_no: 'INV-2024-001',
      vendor_name: 'ABC Electronics Ltd',
      amount: 125000,
      due_date: '2024-01-15',
      status: INVOICE_STATUS.SUBMITTED,
      created_at: '2024-01-01',
    },
    {
      id: 2,
      invoice_no: 'INV-2024-002',
      vendor_name: 'XYZ Construction',
      amount: 750000,
      due_date: '2024-01-20',
      status: INVOICE_STATUS.APPROVED,
      created_at: '2024-01-02',
    },
    {
      id: 3,
      invoice_no: 'INV-2024-003',
      vendor_name: 'Tech Solutions Inc',
      amount: 45000,
      due_date: '2024-01-18',
      status: INVOICE_STATUS.PAID,
      created_at: '2024-01-03',
    },
    {
      id: 4,
      invoice_no: 'INV-2024-004',
      vendor_name: 'Power Systems Ltd',
      amount: 320000,
      due_date: '2024-01-25',
      status: INVOICE_STATUS.DRAFT,
      created_at: '2024-01-04',
    },
    {
      id: 5,
      invoice_no: 'INV-2024-005',
      vendor_name: 'Green Energy Corp',
      amount: 890000,
      due_date: '2024-01-22',
      status: INVOICE_STATUS.REJECTED,
      created_at: '2024-01-05',
    },
  ];

  const invoices = invoicesData?.success ? invoicesData.data : mockInvoices;

  const getStatusBadge = (status) => {
    const statusConfig = {
      [INVOICE_STATUS.DRAFT]: { variant: 'secondary', text: 'Draft' },
      [INVOICE_STATUS.SUBMITTED]: { variant: 'warning', text: 'Submitted' },
      [INVOICE_STATUS.APPROVED]: { variant: 'success', text: 'Approved' },
      [INVOICE_STATUS.PAID]: { variant: 'info', text: 'Paid' },
      [INVOICE_STATUS.REJECTED]: { variant: 'danger', text: 'Rejected' },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: 'Unknown' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (error) {
    return (
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Invoices</h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-warning mb-0">
            Unable to load recent invoices. Please try again.
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-100 recent-invoices-card">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <span className="me-2">📄</span>
            Recent Invoices
          </h5>
          <Link to="/invoices" className="btn btn-outline-primary btn-sm">
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
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Invoice #</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td>
                        <div className="fw-semibold text-primary">{invoice.invoice_no}</div>
                        <small className="text-muted">{formatDate(invoice.created_at)}</small>
                      </td>
                      <td>
                        <div className="fw-medium">{invoice.vendor_name}</div>
                      </td>
                      <td>
                        <div className="fw-semibold">{formatCurrency(invoice.amount)}</div>
                      </td>
                      <td>
                        <div className="text-muted">{formatDate(invoice.due_date)}</div>
                      </td>
                      <td>{getStatusBadge(invoice.status)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/invoices/${invoice.id}`}
                            title="View Invoice"
                          >
                            <FaEye />
                          </Button>
                          {invoice.status === INVOICE_STATUS.DRAFT && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              as={Link}
                              to={`/invoices/${invoice.id}/edit`}
                              title="Edit Invoice"
                            >
                              <FaEdit />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default RecentInvoices;
