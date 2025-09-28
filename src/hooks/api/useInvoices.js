import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { invoicesAPI } from '@services/api/invoices';

// Get all invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesAPI.getAllInvoices,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => (data.success ? data.data : []),
  });
};

// Get single invoice
export const useInvoice = (id) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoicesAPI.getInvoice(id),
    enabled: !!id,
    select: (data) => (data.success ? data.data : null),
  });
};

// Get invoices by status
export const useInvoicesByStatus = (status) => {
  return useQuery({
    queryKey: ['invoices', 'status', status],
    queryFn: () => invoicesAPI.getInvoicesByStatus(status),
    enabled: !!status,
    select: (data) => (data.success ? data.data : []),
  });
};

// Get invoices by vendor
export const useInvoicesByVendor = (vendorId) => {
  return useQuery({
    queryKey: ['invoices', 'vendor', vendorId],
    queryFn: () => invoicesAPI.getInvoicesByVendor(vendorId),
    enabled: !!vendorId,
    select: (data) => (data.success ? data.data : []),
  });
};

// Create invoice mutation
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoicesAPI.createInvoice,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['invoices']);
        toast.success('Invoice created successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to create invoice');
    },
  });
};

// Update invoice mutation
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoicesAPI.updateInvoice,
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries(['invoices']);
        queryClient.invalidateQueries(['invoices', variables.id]);
        toast.success('Invoice updated successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to update invoice');
    },
  });
};

// Delete invoice mutation
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoicesAPI.deleteInvoice,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['invoices']);
        toast.success('Invoice deleted successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to delete invoice');
    },
  });
};

// Update invoice status mutation
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, remark }) => invoicesAPI.updateInvoiceStatus(id, status, remark),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['invoices']);
        toast.success('Invoice status updated successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to update invoice status');
    },
  });
};

// Return invoice mutation
export const useReturnInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remark }) => invoicesAPI.returnInvoice(id, remark),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['invoices']);
        toast.success('Invoice returned successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to return invoice');
    },
  });
};

// File upload mutation
export const useUploadInvoiceFile = () => {
  return useMutation({
    mutationFn: ({ file, onUploadProgress }) =>
      invoicesAPI.uploadInvoiceFile(file, onUploadProgress),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('File uploaded successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to upload file');
    },
  });
};
