import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';

import DataTable from '@components/common/UI/Table/DataTable';
import Button from '@components/common/UI/Button/Button';
import DepartmentForm from '@/pages/departments/DepartmentForm';
import { useDepartments, useCreateDepartment } from '@hooks/api/useUsers';
import { formatDate } from '@utils/helpers/formatHelpers';

const DepartmentsPage = () => {
  const { data: departments = [], isLoading, refetch } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleCreateDepartment = async (departmentData) => {
    try {
      await createDepartmentMutation.mutateAsync(departmentData);
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
    },
    {
      key: 'department_name',
      title: 'Department Name',
      render: (value) => <div className="fw-semibold">{value}</div>,
    },
    {
      key: 'created_by',
      title: 'Created By',
    },
    {
      key: 'created_at',
      title: 'Created Date',
      type: 'date',
      render: (value) => formatDate(value, 'short'),
    },
  ];

  const actions = [
    {
      title: 'Edit',
      icon: <FaEdit />,
      variant: 'outline-secondary',
      onClick: (dept) => console.log('Edit department:', dept),
    },
    {
      title: 'Delete',
      icon: <FaTrash />,
      variant: 'outline-danger',
      onClick: (dept) => console.log('Delete department:', dept),
    },
  ];

  return (
    <div className="departments-page">
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
                <FaBuilding className="me-2 text-primary" />
                Department Management
              </h1>
              <p className="page-subtitle text-muted mb-0">
                Manage organizational departments and structure
              </p>
            </div>
            <div className="page-actions">
              <Button variant="primary" icon={<FaPlus />} onClick={() => setShowCreateModal(true)}>
                Add Department
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
                      <FaBuilding />
                    </div>
                    <div>
                      <h3 className="mb-0">{departments.length}</h3>
                      <p className="text-muted mb-0 small">Total Departments</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Departments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Departments</h5>
                {selectedDepartments.length > 0 && (
                  <div className="d-flex gap-2">
                    <Button variant="outline-danger" size="sm">
                      Delete Selected ({selectedDepartments.length})
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              <DataTable
                data={departments}
                columns={columns}
                loading={isLoading}
                actions={actions}
                searchable
                sortable
                selectable
                onSelectionChange={setSelectedDepartments}
                emptyMessage="No departments found. Click 'Add Department' to get started."
              />
            </Card.Body>
          </Card>
        </motion.div>

        {/* Create Department Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DepartmentForm
              onSubmit={handleCreateDepartment}
              loading={createDepartmentMutation.isPending}
              error={createDepartmentMutation.error?.message}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default DepartmentsPage;
