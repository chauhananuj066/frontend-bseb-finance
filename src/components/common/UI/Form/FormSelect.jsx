import React from 'react';
import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import classNames from 'classnames';

const FormSelect = ({
  name,
  control,
  label,
  options = [],
  placeholder = 'Select an option',
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

  const selectClasses = classNames(
    'form-select',
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

      <Form.Select
        {...field}
        disabled={disabled}
        className={selectClasses}
        isInvalid={invalid}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>

      {helpText && !error && <Form.Text className="text-muted">{helpText}</Form.Text>}

      {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default FormSelect;
