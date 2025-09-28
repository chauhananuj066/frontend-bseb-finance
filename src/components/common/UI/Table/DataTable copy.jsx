import React, { useState, useMemo } from 'react';
import { Table, Form, InputGroup, Button, Dropdown, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
} from 'react-icons/fa';
import useDebounce from '@hooks/common/useDebounce';
import './DataTable.scss';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  filterable = false,
  selectable = false,
  actions = [],
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No data available',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        })
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, debouncedSearchTerm, sortConfig, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(paginatedData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
    onSelectionChange?.(checked ? paginatedData : []);
  };

  const handleSelectRow = (rowId, checked) => {
    const updatedSelection = checked
      ? [...selectedRows, rowId]
      : selectedRows.filter((id) => id !== rowId);

    setSelectedRows(updatedSelection);
    onSelectionChange?.(data.filter((row) => updatedSelection.includes(row.id)));
  };

  const renderSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return <FaSort className="text-muted" />;
    }
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="text-primary" />
    ) : (
      <FaSortDown className="text-primary" />
    );
  };

  const renderCellValue = (value, column) => {
    if (column.render) {
      return column.render(value);
    }

    if (column.type === 'badge') {
      const variant = column.badgeVariant?.(value) || 'secondary';
      return <Badge bg={variant}>{value}</Badge>;
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(value || 0);
    }

    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('en-IN') : '-';
    }

    return value || '-';
  };

  if (loading) {
    return (
      <div className="data-table-loading">
        <Table responsive className={className}>
          <thead>
            <tr>
              {selectable && <th style={{ width: '40px' }}></th>}
              {columns.map((column) => (
                <th key={column.key}>
                  <div className="loading-skeleton" style={{ height: '20px', width: '80%' }}></div>
                </th>
              ))}
              {actions.length > 0 && <th style={{ width: '120px' }}></th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                {selectable && (
                  <td>
                    <div
                      className="loading-skeleton"
                      style={{ height: '16px', width: '16px' }}
                    ></div>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key}>
                    <div className="loading-skeleton" style={{ height: '20px' }}></div>
                  </td>
                ))}
                {actions.length > 0 && (
                  <td>
                    <div
                      className="loading-skeleton"
                      style={{ height: '32px', width: '100px' }}
                    ></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div className={`data-table-wrapper ${className}`}>
      {/* Table Controls */}
      <div className="data-table-controls mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* Search */}
          {searchable && (
            <div className="data-table-search">
              <InputGroup style={{ maxWidth: '300px' }}>
                <InputGroup.Text>
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex gap-2">
            {filterable && (
              <Button variant="outline-secondary" size="sm">
                <FaFilter className="me-1" />
                Filters
              </Button>
            )}

            <Button variant="outline-secondary" size="sm">
              <FaDownload className="me-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Selection Info */}
        {selectable && selectedRows.length > 0 && (
          <div className="data-table-selection-info mt-2">
            <div className="d-flex justify-content-between align-items-center p-2 bg-primary bg-opacity-10 rounded">
              <span>{selectedRows.length} items selected</span>
              <div className="btn-group btn-group-sm">
                <Button variant="outline-primary" size="sm">
                  Bulk Action
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleSelectAll(false)}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover className="data-table">
          <thead className="table-light">
            <tr>
              {selectable && (
                <th style={{ width: '40px' }}>
                  <Form.Check
                    checked={
                      selectedRows.length === paginatedData.length && paginatedData.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={sortable ? 'sortable' : ''}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="th-content">
                    {column.title}
                    {sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}

              {actions.length > 0 && <th style={{ width: '120px' }}>Actions</th>}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={onRowClick ? 'clickable-row' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td>
                      <Form.Check
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td key={column.key}>{renderCellValue(row[column.key], column)}</td>
                  ))}

                  {actions.length > 0 && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="btn-group btn-group-sm">
                        {actions.slice(0, 2).map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'outline-secondary'}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            title={action.title}
                          >
                            {action.icon}
                          </Button>
                        ))}

                        {actions.length > 2 && (
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              className="dropdown-toggle-no-caret"
                            >
                              <FaEllipsisV />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {actions.slice(2).map((action, actionIndex) => (
                                <Dropdown.Item
                                  key={actionIndex}
                                  onClick={() => action.onClick(row)}
                                >
                                  {action.icon && <span className="me-2">{action.icon}</span>}
                                  {action.title}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>

        {/* Empty State */}
        {processedData.length === 0 && (
          <div className="data-table-empty text-center py-5">
            <div className="text-muted">
              <div className="fs-1 mb-2">📭</div>
              <p className="mb-0">{emptyMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="data-table-pagination mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, processedData.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}{' '}
              entries
            </div>

            <div className="btn-group btn-group-sm">
              <Button
                variant="outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline-secondary'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return (
                    <span key={page} className="btn btn-outline-secondary disabled">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <Button
                variant="outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
