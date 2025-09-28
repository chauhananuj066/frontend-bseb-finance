import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

import UserForm from '@pages/users/UserForm';
import Button from '@components/common/UI/Button/Button';
import { useCreateUser } from '@hooks/api/useUsers';

const CreateUser = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  // const handleSubmit = async (userData) => {
  //   try {
  //     const result = await createUserMutation.mutateAsync(userData);
  //     if (result.success) {
  //       navigate('/users');
  //     }
  //   } catch (error) {
  //     console.error('Failed to create user:', error);
  //   }
  // };

  const handleSubmit = async (userData) => {
    try {
      const result = await createUserMutation.mutateAsync(userData);

      if (result?.id) {
        // ✅ Agar user create hua hai
        navigate('/users');
      } else {
        console.error('Unexpected API response:', result);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div className="create-user-page">
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
              <h1 className="page-title mb-1">Create New User</h1>
              <p className="page-subtitle text-muted mb-0">
                Add a new user to the system with appropriate role and permissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Form */}
        <UserForm
          onSubmit={handleSubmit}
          loading={createUserMutation.isPending}
          error={createUserMutation.error?.message}
        />
      </Container>
    </div>
  );
};

export default CreateUser;
