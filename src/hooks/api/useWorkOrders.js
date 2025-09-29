import { useState, useCallback } from 'react';
import { workOrderAPI } from '../../services/api/workorders';

export const useWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workOrderAPI.getAll();
      setWorkOrders(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkOrder = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await workOrderAPI.create(formData);
        await fetchWorkOrders(); // Refresh list
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchWorkOrders]
  );

  const updateWorkOrder = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await workOrderAPI.update(formData);
        await fetchWorkOrders(); // Refresh list
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchWorkOrders]
  );

  const deleteWorkOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await workOrderAPI.delete(id);
      setWorkOrders((prev) => prev.filter((wo) => wo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workOrders,
    loading,
    error,
    fetchWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
  };
};
