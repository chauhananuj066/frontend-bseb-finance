import { useState, useCallback, useEffect } from 'react';
import { departmentAPI } from '../../services/api/departments';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentAPI.getAll();
      setDepartments(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const getDepartmentById = useCallback(
    (id) => {
      return departments.find((d) => d.id === id);
    },
    [departments]
  );

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    getDepartmentById,
  };
};
