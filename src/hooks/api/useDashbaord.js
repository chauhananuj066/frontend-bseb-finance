import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@services/api/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardAPI.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useRecentInvoices = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-invoices', limit],
    queryFn: () => dashboardAPI.getRecentInvoices(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['dashboard', 'pending-approvals'],
    queryFn: dashboardAPI.getPendingApprovals,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePaymentSummary = (period = 'month') => {
  return useQuery({
    queryKey: ['dashboard', 'payment-summary', period],
    queryFn: () => dashboardAPI.getPaymentSummary(period),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueChart = (months = 6) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart', months],
    queryFn: () => dashboardAPI.getRevenueChart(months),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
