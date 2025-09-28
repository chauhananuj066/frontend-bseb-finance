import React from 'react';
import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import classNames from 'classnames';

const FormInput = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helpText,
  ...props
}) => {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  const inputClasses = classNames(
    'form-control',
    {
      'is-invalid': invalid,
    },
    className
  );

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}

      <Form.Control
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        isInvalid={invalid}
        {...props}
      />

      {helpText && !error && <Form.Text className="text-muted">{helpText}</Form.Text>}

      {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default FormInput;
