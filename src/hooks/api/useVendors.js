import { useState, useCallback, useEffect } from 'react';
import { vendorAPI } from '../../services/api/vendors';

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorAPI.getAll();
      setVendors(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vendors:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const getVendorByNo = useCallback(
    (vendorNo) => {
      return vendors.find((v) => v.No_ === vendorNo);
    },
    [vendors]
  );

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    getVendorByNo,
  };
};
