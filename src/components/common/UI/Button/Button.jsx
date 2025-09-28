import React from 'react';
import { Button as BSButton } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import './Button.scss';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonClasses = classNames(
    'custom-btn',
    `btn-${variant}`,
    `btn-${size}`,
    {
      'btn-loading': loading,
      'btn-icon-only': icon && !children,
    },
    className
  );

  const renderIcon = () => {
    if (loading) {
      return <Spinner as="span" animation="border" size="sm" />;
    }
    return icon;
  };

  return (
    <BSButton className={buttonClasses} disabled={isDisabled} {...props}>
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{renderIcon()}</span>
      )}

      {children && <span className="btn-text">{children}</span>}

      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{renderIcon()}</span>
      )}
    </BSButton>
  );
};

export default Button;
