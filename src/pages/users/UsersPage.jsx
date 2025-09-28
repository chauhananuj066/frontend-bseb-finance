import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPlus, FaEye, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import DataTable from '@components/common/UI/Table/DataTable';
import Button from '@components/common/UI/Button/Button';
import { useUsers, useDeleteUser } from '@hooks/api/useUsers';
import { formatDate } from '@utils/helpers/formatHelpers';
import { USER_ROLES } from '@utils/constants';

const UsersPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        refetch();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      [USER_ROLES.ADMIN]: 'danger',
      [USER_ROLES.MANAGER]: 'warning',
      [USER_ROLES.ACCOUNTANT]: 'info',
      [USER_ROLES.CLERK]: 'secondary',
    };
    return variants[role] || 'secondary';
  };

  const columns = [
    {
      key: 'username',
      title: 'Username',
      render: (value, row) => (
        <div>
          <div className="fw-semibold">{value}</div>
          <small className="text-muted">{row.email}</small>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      type: 'badge',
      render: (value) => (
        <Badge bg={getRoleBadgeVariant(value)}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      render: (value) => value || 'Not Assigned',
    },
    {
      key: 'created_at',
      title: 'Created Date',
      type: 'date',
      render: (value) => formatDate(value, 'short'),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, row) => (
        <Badge bg={row.id ? 'success' : 'secondary'}>{row.id ? 'Active' : 'Inactive'}</Badge>
      ),
    },
  ];

  const actions = [
    {
      title: 'View',
      icon: <FaEye />,
      variant: 'outline-primary',
      onClick: (user) => navigate(`/users/${user.id}`),
    },
    {
      title: 'Edit',
      icon: <FaEdit />,
      variant: 'outline-secondary',
      onClick: (user) => navigate(`/users/${user.id}/edit`),
    },
    {
      title: 'Delete',
      icon: <FaTrash />,
      variant: 'outline-danger',
      onClick: handleDeleteUser,
    },
  ];

  return (
    <div className="users-page">
      <Container fluid>
        {/* Page Header */}
        <motion.div
          className="page-header mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title mb-1 d-flex align-items-center">
                <FaUsers className="me-2 text-primary" />
                User Management
              </h1>
              <p className="page-subtitle text-muted mb-0">
                Manage system users, roles, and permissions
              </p>
            </div>
            <div className="page-actions">
              <Button variant="primary" icon={<FaPlus />} as={Link} to="/users/create">
                Add New User
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Row className="g-3 mb-4">
          <Col sm={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="stats-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon bg-primary bg-opacity-10 text-primary me-3">
                      <FaUsers />
                    </div>
                    <div>
                      <h3 className="mb-0">{users.length}</h3>
                      <p className="text-muted mb-0 small">Total Users</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col sm={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="stats-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon bg-danger bg-opacity-10 text-danger me-3">👑</div>
                    <div>
                      <h3 className="mb-0">
                        {users.filter((u) => u.role === USER_ROLES.ADMIN).length}
                      </h3>
                      <p className="text-muted mb-0 small">Administrators</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col sm={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="stats-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon bg-warning bg-opacity-10 text-warning me-3">👔</div>
                    <div>
                      <h3 className="mb-0">
                        {users.filter((u) => u.role === USER_ROLES.MANAGER).length}
                      </h3>
                      <p className="text-muted mb-0 small">Managers</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col sm={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="stats-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="stats-icon bg-success bg-opacity-10 text-success me-3">✅</div>
                    <div>
                      <h3 className="mb-0">{users.length}</h3>
                      <p className="text-muted mb-0 small">Active Users</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Users</h5>
                {selectedUsers.length > 0 && (
                  <div className="d-flex gap-2">
                    <Button variant="outline-danger" size="sm">
                      Delete Selected ({selectedUsers.length})
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              <DataTable
                data={users}
                columns={columns}
                loading={isLoading}
                actions={actions}
                searchable
                sortable
                selectable
                onSelectionChange={setSelectedUsers}
                emptyMessage="No users found. Click 'Add New User' to get started."
              />
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default UsersPage;
