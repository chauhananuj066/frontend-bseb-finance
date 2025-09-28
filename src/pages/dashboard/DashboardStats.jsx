import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import FaInvoiceDollar  from 'react-icons/fa';
import { FaMoneyBillWave, FaClock, FaUsers, FaFileInvoice, FaCheckCircle } from 'react-icons/fa';

import StatsCard from '../../components/common/UI/Cards/StatsCard.jsx';
import { useDashboardStats } from '../../hooks/api/useDashbaord';
import { formatCurrency, formatNumber } from '@utils/helpers/formatHelpers';

const DashboardStats = () => {
  const { data: statsData, isLoading, error } = useDashboardStats();

  // Mock data for development (replace with real API data)
  const mockStats = {
    totalInvoices: 1247,
    totalAmount: 15750000,
    pendingApprovals: 23,
    processedPayments: 856,
    activeVendors: 145,
    completedOrders: 432,
    monthlyGrowth: 12.5,
    paymentGrowth: -3.2,
  };

  const stats = statsData?.success ? statsData.data : mockStats;

  const statsCards = [
    {
      title: 'Total Invoices',
      value: formatNumber(stats.totalInvoices),
      change: `+${stats.monthlyGrowth}% this month`,
      changeType: 'positive',
      icon: <FaFileInvoice />,
      color: 'primary',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      change: `+${Math.abs(stats.paymentGrowth)}% from last month`,
      changeType: stats.paymentGrowth > 0 ? 'positive' : 'negative',
      icon: <FaMoneyBillWave />,
      color: 'success',
    },
    {
      title: 'Pending Approvals',
      value: formatNumber(stats.pendingApprovals),
      change: 'Requires attention',
      changeType: 'neutral',
      icon: <FaClock />,
      color: 'warning',
    },
    {
      title: 'Processed Payments',
      value: formatNumber(stats.processedPayments),
      change: '+8.2% this week',
      changeType: 'positive',
      icon: <FaCheckCircle />,
      color: 'success',
    },
    {
      title: 'Active Vendors',
      value: formatNumber(stats.activeVendors),
      change: '+5 new vendors',
      changeType: 'positive',
      icon: <FaUsers />,
      color: 'primary',
    },
    {
      title: 'Work Orders',
      value: formatNumber(stats.completedOrders),
      change: 'Completed this month',
      changeType: 'neutral',
      icon: <FaUsers />,
      color: 'primary',
    },
  ];

  if (error) {
    return (
      <div className="alert alert-warning">
        <strong>Unable to load statistics.</strong> Please try refreshing the page.
      </div>
    );
  }

  return (
    <Row className="g-4 mb-4">
      {statsCards.map((card, index) => (
        <Col key={index} sm={6} lg={4} xl={2}>
          <StatsCard
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
            color={card.color}
            loading={isLoading}
          />
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;
