import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { usersAPI, departmentsAPI } from '@services/api/users';

// Users hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => (data.success ? data.data : []),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersAPI.getUser(id),
    enabled: !!id,
    select: (data) => (data.success ? data.data : null),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersAPI.createUser,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['users']);
        toast.success('User created successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => usersAPI.updateUser(id, userData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries(['users']);
        queryClient.invalidateQueries(['users', variables.id]);
        toast.success('User updated successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersAPI.deleteUser,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['users']);
        toast.success('User deleted successfully!');
      } else {
        toast.error(data.error);
      }
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
};

// Departments hooks
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: departmentsAPI.getAllDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => (data.success ? data.data : []),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsAPI.createDepartment,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(['departments']);
        toast.success('Department created successfully!');
      } else {
        toast.error(data.error);
      }
    },
  });
};
