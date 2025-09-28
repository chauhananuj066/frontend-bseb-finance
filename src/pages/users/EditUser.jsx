import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

import UserForm from '@pages/users/UserForm';
import Button from '@components/common/UI/Button/Button';
import { useUser, useUpdateUser } from '@hooks/api/useUsers';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser(id);
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (userData) => {
    try {
      const result = await updateUserMutation.mutateAsync({ id, userData });
      if (result.success) {
        navigate('/users');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (userLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-page">
      <Container fluid>
        {/* Page Header */}
        <motion.div
          className="page-header mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="d-flex align-items-center mb-3">
            <Button
              variant="outline-secondary"
              icon={<FaArrowLeft />}
              onClick={() => navigate('/users')}
              className="me-3"
            >
              Back to Users
            </Button>
            <div>
              <h1 className="page-title mb-1">Edit User</h1>
              <p className="page-subtitle text-muted mb-0">
                Update user information and permissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Form */}
        <UserForm
          initialData={user}
          onSubmit={handleSubmit}
          loading={updateUserMutation.isPending}
          error={updateUserMutation.error?.message}
          isEdit={true}
        />
      </Container>
    </div>
  );
};

export default EditUser;
