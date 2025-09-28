import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaBuilding } from 'react-icons/fa';

import FormInput from '@components/common/UI/Form/FormInput';
import FormSelect from '@components/common/UI/Form/FormSelect';
import Button from '@components/common/UI/Button/Button';
import { userSchema } from '@utils/validators/userValidation';
import { useDepartments } from '@hooks/api/useUsers';
import { USER_ROLES } from '@utils/constants';

const UserForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
  isEdit = false,
}) => {
  const { data: departments = [], isLoading: departmentsLoading } = useDepartments();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEdit },
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username || '',
        email: initialData.email || '',
        role: initialData.role || '',
        department: initialData.department || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [initialData, reset]);

  const roleOptions = Object.entries(USER_ROLES).map(([key, value]) => ({
    value,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }));

  const departmentOptions = departments.map((dept) => ({
    value: dept.department_name,
    label: dept.department_name,
  }));

  const onFormSubmit = (data) => {
    const submitData = { ...data };

    // Remove password fields if empty in edit mode
    if (isEdit && (!submitData.password || submitData.password.trim() === '')) {
      delete submitData.password;
      delete submitData.confirmPassword;
    }

    onSubmit(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="user-form-card">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <FaUser className="me-2 text-primary" />
            {isEdit ? 'Edit User' : 'Create New User'}
          </h5>
        </Card.Header>

        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-4">
              <strong>Error:</strong> {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
              {/* Basic Information */}
              <Col md={6}>
                <div className="form-section mb-4">
                  <h6 className="form-section-title mb-3">Basic Information</h6>

                  <FormInput
                    name="username"
                    control={control}
                    label="Username"
                    placeholder="Enter username"
                    icon={<FaUser />}
                    required
                    disabled={loading}
                  />

                  <FormInput
                    name="email"
                    control={control}
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    icon={<FaEnvelope />}
                    required
                    disabled={loading}
                  />
                </div>
              </Col>

              {/* Security Information */}
              <Col md={6}>
                <div className="form-section mb-4">
                  <h6 className="form-section-title mb-3">
                    {isEdit ? 'Change Password (Optional)' : 'Security Information'}
                  </h6>

                  <FormInput
                    name="password"
                    control={control}
                    label={isEdit ? 'New Password' : 'Password'}
                    type="password"
                    placeholder={isEdit ? 'Leave empty to keep current password' : 'Enter password'}
                    icon={<FaLock />}
                    required={!isEdit}
                    disabled={loading}
                    helpText={
                      isEdit
                        ? 'Leave empty to keep current password'
                        : 'Must contain uppercase, lowercase, number and special character'
                    }
                  />

                  <FormInput
                    name="confirmPassword"
                    control={control}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    icon={<FaLock />}
                    disabled={loading}
                  />
                </div>
              </Col>
            </Row>

            {/* Role and Department */}
            <Row>
              <Col md={6}>
                <div className="form-section mb-4">
                  <h6 className="form-section-title mb-3">Role & Permissions</h6>

                  <FormSelect
                    name="role"
                    control={control}
                    label="User Role"
                    options={roleOptions}
                    placeholder="Select user role"
                    icon={<FaUserTag />}
                    required
                    disabled={loading}
                    helpText="Role determines user permissions and access levels"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-section mb-4">
                  <h6 className="form-section-title mb-3">Department</h6>

                  <FormSelect
                    name="department"
                    control={control}
                    label="Department"
                    options={departmentOptions}
                    placeholder="Select department"
                    icon={<FaBuilding />}
                    required
                    disabled={loading || departmentsLoading}
                    helpText="User's department for access control"
                  />
                </div>
              </Col>
            </Row>

            {/* Form Actions */}
            <div className="form-actions mt-4 pt-3 border-top">
              <div className="d-flex justify-content-end gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  disabled={loading}
                  onClick={() => reset()}
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={!isValid || loading}
                >
                  {isEdit ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </div>
          </form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default UserForm;
