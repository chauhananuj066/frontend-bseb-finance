import React, { useState, useRef } from 'react';
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaFile, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import './FormFileUpload.scss';

const FormFileUpload = ({
  name,
  control,
  label,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 10485760, // 10MB
  multiple = false,
  required = false,
  disabled = false,
  className = '',
  helpText,
  onUploadProgress,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const {
    field: { value, onChange },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = accept.split(',').map((type) => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const isValidType = allowedTypes.some(
      (type) => type === fileExtension || (file.type && file.type.match(type.replace('*', '.*')))
    );

    if (!isValidType) {
      errors.push(`File type not allowed. Allowed types: ${accept}`);
    }

    return errors;
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Single file for now
    const validationErrors = validateFile(file);

    if (validationErrors.length > 0) {
      // Handle validation errors
      console.error('File validation errors:', validationErrors);
      return;
    }

    onChange(file);

    // Simulate upload progress if callback provided
    if (onUploadProgress) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(null), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FaFile />;

    const extension = file.name.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
    };

    return iconMap[extension] || '📄';
  };

  return (
    <Form.Group className={`file-upload-group mb-3 ${className}`}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}

      <div
        className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${invalid ? 'is-invalid' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="d-none"
          {...props}
        />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="file-preview"
            >
              <div className="file-info">
                <div className="file-icon">{getFileIcon(value)}</div>
                <div className="file-details">
                  <div className="file-name">{value.name}</div>
                  <div className="file-size text-muted">{formatFileSize(value.size)}</div>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="upload-progress mb-2">
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    animated={uploadProgress < 100}
                  />
                </div>
              )}

              <div className="file-actions">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview file logic here
                  }}
                  title="Preview"
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download file logic here
                  }}
                  title="Download"
                >
                  <FaDownload />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  title="Remove"
                >
                  <FaTrash />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="upload-prompt text-center"
            >
              <div className="upload-icon mb-2">
                <FaCloudUploadAlt size={32} />
              </div>
              <div className="upload-text">
                <div className="fw-semibold">Drop files here or click to browse</div>
                <small className="text-muted">
                  Accepted formats: {accept} (Max: {formatFileSize(maxSize)})
                </small>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {helpText && !error && <Form.Text className="text-muted">{helpText}</Form.Text>}

      {error && <div className="invalid-feedback d-block">{error.message}</div>}
    </Form.Group>
  );
};

export default FormFileUpload;
