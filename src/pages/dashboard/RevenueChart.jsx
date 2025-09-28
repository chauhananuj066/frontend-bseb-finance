import React, { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { useRevenueChart } from '../../hooks/api/useDashbaord';
import { formatCurrency } from '@utils/helpers/formatHelpers';

const RevenueChart = () => {
  const [period, setPeriod] = useState('6months');
  const { data: chartData, isLoading, error } = useRevenueChart();

  // Mock data for development
  const mockData = [
    { month: 'Jul', revenue: 2400000, expenses: 1800000, profit: 600000 },
    { month: 'Aug', revenue: 2800000, expenses: 2100000, profit: 700000 },
    { month: 'Sep', revenue: 3200000, expenses: 2300000, profit: 900000 },
    { month: 'Oct', revenue: 2900000, expenses: 2200000, profit: 700000 },
    { month: 'Nov', revenue: 3500000, expenses: 2600000, profit: 900000 },
    { month: 'Dec', revenue: 4100000, expenses: 2800000, profit: 1300000 },
  ];

  const data = chartData?.success ? chartData.data : mockData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="fw-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">Revenue Overview</h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-warning mb-0">
            Unable to load chart data. Please try again.
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="h-100 revenue-chart-card">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <span className="me-2">📈</span>
            Revenue Overview
          </h5>
          <ButtonGroup size="sm">
            {['3months', '6months', '1year'].map((p) => (
              <Button
                key={p}
                variant={period === p ? 'primary' : 'outline-primary'}
                onClick={() => setPeriod(p)}
              >
                {p === '3months' ? '3M' : p === '6months' ? '6M' : '1Y'}
              </Button>
            ))}
          </ButtonGroup>
        </Card.Header>

        <Card.Body>
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '300px' }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default RevenueChart;
