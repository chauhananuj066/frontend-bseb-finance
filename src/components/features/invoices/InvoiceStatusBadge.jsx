import React from 'react';
import { Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { INVOICE_STATUS } from '@utils/constants';

const InvoiceStatusBadge = ({ status, className = '', animated = true }) => {
  const getStatusConfig = (status) => {
    const configs = {
      [INVOICE_STATUS.DRAFT]: {
        variant: 'secondary',
        text: 'Draft',
        icon: '📝',
        color: '#6c757d',
      },
      [INVOICE_STATUS.SUBMITTED]: {
        variant: 'warning',
        text: 'Submitted',
        icon: '📤',
        color: '#fd7e14',
      },
      [INVOICE_STATUS.APPROVED]: {
        variant: 'success',
        text: 'Approved',
        icon: '✅',
        color: '#198754',
      },
      [INVOICE_STATUS.PAID]: {
        variant: 'info',
        text: 'Paid',
        icon: '💰',
        color: '#0dcaf0',
      },
      [INVOICE_STATUS.REJECTED]: {
        variant: 'danger',
        text: 'Rejected',
        icon: '❌',
        color: '#dc3545',
      },
      [INVOICE_STATUS.DELETED]: {
        variant: 'dark',
        text: 'Deleted',
        icon: '🗑️',
        color: '#212529',
      },
    };

    return (
      configs[status] || {
        variant: 'secondary',
        text: 'Unknown',
        icon: '❓',
        color: '#6c757d',
      }
    );
  };

  const config = getStatusConfig(status);

  const BadgeComponent = (
    <Badge bg={config.variant} className={`invoice-status-badge ${className}`}>
      <span className="me-1">{config.icon}</span>
      {config.text}
    </Badge>
  );

  if (!animated) {
    return BadgeComponent;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {BadgeComponent}
    </motion.div>
  );
};

export default InvoiceStatusBadge;
