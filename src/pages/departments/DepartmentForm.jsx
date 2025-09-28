import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaBuilding } from 'react-icons/fa';

import FormInput from '@components/common/UI/Form/FormInput';
import Button from '@components/common/UI/Button/Button';
import { departmentSchema } from '@utils/validators/userValidation';

const DepartmentForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
  isEdit = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: {
      department_name: '',
      created_by: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        department_name: initialData.department_name || '',
        created_by: initialData.created_by || '',
      });
    }
  }, [initialData, reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <FaBuilding className="me-2 text-primary" />
            {isEdit ? 'Edit Department' : 'Create New Department'}
          </h5>
        </Card.Header>

        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-4">
              <strong>Error:</strong> {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="department_name"
              control={control}
              label="Department Name"
              placeholder="Enter department name"
              icon={<FaBuilding />}
              required
              disabled={loading}
            />

            <FormInput
              name="created_by"
              control={control}
              label="Created By"
              placeholder="Enter creator name"
              required
              disabled={loading}
            />

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
                  {isEdit ? 'Update Department' : 'Create Department'}
                </Button>
              </div>
            </div>
          </form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default DepartmentForm;
