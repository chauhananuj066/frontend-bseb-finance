import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  RotateCcw,
  Plus,
  FileText,
  Calendar,
  Building,
  User,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const InvoicesPage = () => {
  // State management
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkOperation, setBulkOperation] = useState('');
  const [bulkRemark, setBulkRemark] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Mock data for demonstration
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      vendor: { name: 'Tech Solutions Ltd', email: 'contact@techsolutions.com' },
      department: { name: 'IT Department' },
      amount: 150000,
      tax: 27000,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      description: 'Software licensing and support',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      vendor: { name: 'Office Supplies Co', email: 'orders@officesupplies.com' },
      department: { name: 'Administration' },
      amount: 45000,
      tax: 8100,
      status: 'approved',
      createdAt: '2024-01-14T14:20:00Z',
      description: 'Office furniture and supplies',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      vendor: { name: 'Construction Corp', email: 'billing@construction.com' },
      department: { name: 'Infrastructure' },
      amount: 500000,
      tax: 90000,
      status: 'rejected',
      createdAt: '2024-01-13T09:15:00Z',
      description: 'Building maintenance and repairs',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      vendor: { name: 'Educational Materials Inc', email: 'sales@edumat.com' },
      department: { name: 'Academic Affairs' },
      amount: 80000,
      tax: 14400,
      status: 'paid',
      createdAt: '2024-01-12T16:45:00Z',
      description: 'Textbooks and learning materials',
    },
    {
      id: 5,
      invoiceNumber: 'INV-2024-005',
      vendor: { name: 'Catering Services', email: 'info@catering.com' },
      department: { name: 'Events' },
      amount: 25000,
      tax: 4500,
      status: 'draft',
      createdAt: '2024-01-11T11:20:00Z',
      description: 'Event catering services',
    },
  ];

  // Status configurations
  const statusConfig = {
    draft: { label: 'Draft', className: 'status-draft', icon: Edit },
    pending: { label: 'Pending Review', className: 'status-pending', icon: Calendar },
    approved: { label: 'Approved', className: 'status-approved', icon: Check },
    rejected: { label: 'Rejected', className: 'status-rejected', icon: X },
    paid: { label: 'Paid', className: 'status-paid', icon: DollarSign },
  };

  // Calculate stats
  const stats = mockInvoices.reduce(
    (acc, inv) => {
      acc.total++;
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      acc.totalAmount += inv.amount || 0;
      return acc;
    },
    { total: 0, totalAmount: 0 }
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter and sort invoices
  useEffect(() => {
    let filtered = mockInvoices.filter((invoice) => {
      const matchesSearch =
        !searchTerm ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || invoice.status === statusFilter;

      const matchesDateFrom =
        !dateFromFilter || new Date(invoice.createdAt) >= new Date(dateFromFilter);

      const matchesDateTo = !dateToFilter || new Date(invoice.createdAt) <= new Date(dateToFilter);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Sort invoices
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'vendor') {
        aVal = a.vendor.name;
        bVal = b.vendor.name;
      } else if (sortField === 'department') {
        aVal = a.department.name;
        bVal = b.department.name;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredInvoices(filtered);
    setInvoices(filtered);
  }, [searchTerm, statusFilter, dateFromFilter, dateToFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Event handlers
  const handleSelectAll = () => {
    if (selectedInvoices.length === currentInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(currentInvoices.map((inv) => inv.id));
    }
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Invoice ${id} status changed to ${status}`);
    }, 1000);
  };

  const handleBulkOperation = () => {
    if (!bulkOperation || selectedInvoices.length === 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowBulkModal(false);
      setSelectedInvoices([]);
      setBulkOperation('');
      setBulkRemark('');
      alert(`Bulk ${bulkOperation} completed for ${selectedInvoices.length} invoices`);
    }, 1500);
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.className}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="invoice-management-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-card stats-primary">
          <div className="stats-icon">
            <FileText size={32} />
          </div>
          <div className="stats-content">
            <div className="stats-value">{stats.total}</div>
            <div className="stats-label">Total Invoices</div>
          </div>
        </div>

        <div className="stats-card stats-warning">
          <div className="stats-icon">
            <Calendar size={32} />
          </div>
          <div className="stats-content">
            <div className="stats-value">{stats.pending || 0}</div>
            <div className="stats-label">Pending Review</div>
          </div>
        </div>

        <div className="stats-card stats-success">
          <div className="stats-icon">
            <Check size={32} />
          </div>
          <div className="stats-content">
            <div className="stats-value">{stats.approved || 0}</div>
            <div className="stats-label">Approved</div>
          </div>
        </div>

        <div className="stats-card stats-info">
          <div className="stats-icon">
            <TrendingUp size={32} />
          </div>
          <div className="stats-content">
            <div className="stats-value">{formatCurrency(stats.totalAmount || 0)}</div>
            <div className="stats-label">Total Value</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="invoice-card">
        <div className="invoice-header">
          <div className="header-left">
            <h2 className="page-title">
              <FileText className="title-icon" />
              Invoice List
              {selectedInvoices.length > 0 && (
                <span className="selection-badge">{selectedInvoices.length} selected</span>
              )}
            </h2>
          </div>

          <div className="header-actions">
            <button
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>

            <button className="action-btn secondary">
              <Download size={16} />
              Export
            </button>

            <button className="action-btn primary">
              <Plus size={16} />
              Create Invoice
            </button>

            {selectedInvoices.length > 0 && (
              <button className="bulk-btn" onClick={() => setShowBulkModal(true)}>
                Bulk Actions ({selectedInvoices.length})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <div className="search-input">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  placeholder="From Date"
                />
              </div>

              <div className="filter-group">
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  placeholder="To Date"
                />
              </div>

              <div className="filter-group">
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setDateFromFilter('');
                    setDateToFilter('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <div>Loading invoices...</div>
            </div>
          ) : (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedInvoices.length === currentInvoices.length &&
                        currentInvoices.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => handleSort('invoiceNumber')} className="sortable">
                    Invoice #
                    {sortField === 'invoiceNumber' &&
                      (sortDirection === 'asc' ? (
                        <ChevronDown size={16} className="sort-icon" />
                      ) : (
                        <ChevronDown size={16} className="sort-icon rotated" />
                      ))}
                  </th>
                  <th onClick={() => handleSort('vendor')} className="sortable">
                    Vendor
                  </th>
                  <th onClick={() => handleSort('department')} className="sortable">
                    Department
                  </th>
                  <th onClick={() => handleSort('amount')} className="sortable amount-col">
                    Amount
                  </th>
                  <th onClick={() => handleSort('status')} className="sortable">
                    Status
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                      />
                    </td>
                    <td>
                      <div className="invoice-number">
                        <span className="number">{invoice.invoiceNumber}</span>
                        <span className="date">{formatDate(invoice.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="vendor-info">
                        <div className="vendor-name">{invoice.vendor.name}</div>
                        <div className="vendor-email">{invoice.vendor.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="department-badge">
                        <Building size={14} />
                        {invoice.department.name}
                      </div>
                    </td>
                    <td className="amount-col">
                      <div className="amount-display">
                        <span className="amount">{formatCurrency(invoice.amount)}</span>
                        {invoice.tax && (
                          <span className="tax">+{formatCurrency(invoice.tax)} tax</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td>
                      <div className="action-dropdown">
                        <button className="dropdown-toggle">
                          Actions <ChevronDown size={14} />
                        </button>
                        <div className="dropdown-menu">
                          <button>
                            <Eye size={14} /> View Details
                          </button>
                          <button>
                            <Edit size={14} /> Edit Invoice
                          </button>
                          <button className="success">
                            <Check size={14} /> Approve
                          </button>
                          <button className="danger">
                            <X size={14} /> Reject
                          </button>
                          <button className="warning">
                            <RotateCcw size={14} /> Return
                          </button>
                          <button className="danger">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of{' '}
            {filteredInvoices.length} entries
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bulk Operations</h3>
              <button onClick={() => setShowBulkModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Perform bulk action on {selectedInvoices.length} selected invoices:</p>

              <div className="form-group">
                <label>Select Operation</label>
                <select value={bulkOperation} onChange={(e) => setBulkOperation(e.target.value)}>
                  <option value="">Choose operation...</option>
                  <option value="approve">Approve All</option>
                  <option value="reject">Reject All</option>
                  <option value="return">Return All</option>
                  <option value="delete">Delete All</option>
                </select>
              </div>

              <div className="form-group">
                <label>Remark (Optional)</label>
                <textarea
                  value={bulkRemark}
                  onChange={(e) => setBulkRemark(e.target.value)}
                  placeholder="Enter remark for this bulk operation..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn secondary" onClick={() => setShowBulkModal(false)}>
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={handleBulkOperation}
                disabled={!bulkOperation}
              >
                Execute Operation
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .invoice-management-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stats-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stats-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .stats-primary {
          --accent-color: linear-gradient(135deg, #667eea, #764ba2);
        }
        .stats-warning {
          --accent-color: linear-gradient(135deg, #f093fb, #f5576c);
        }
        .stats-success {
          --accent-color: linear-gradient(135deg, #4facfe, #00f2fe);
        }
        .stats-info {
          --accent-color: linear-gradient(135deg, #43e97b, #38f9d7);
        }

        .stats-primary::before {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .stats-warning::before {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }
        .stats-success::before {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
        }
        .stats-info::before {
          background: linear-gradient(135deg, #43e97b, #38f9d7);
        }

        .stats-icon {
          margin-right: 20px;
          opacity: 0.8;
          color: #6c757d;
        }

        .stats-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
          margin-bottom: 5px;
        }

        .stats-label {
          font-size: 0.9rem;
          color: #718096;
          font-weight: 500;
        }

        .invoice-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .invoice-header {
          padding: 25px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
        }

        .title-icon {
          color: #667eea;
        }

        .selection-badge {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-left: 10px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn,
        .action-btn,
        .bulk-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .filter-btn:hover,
        .action-btn:hover,
        .bulk-btn:hover {
          border-color: #cbd5e0;
          background: #f8fafc;
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .action-btn.primary {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .action-btn.secondary {
          color: #4a5568;
        }

        .bulk-btn {
          background: #48bb78;
          color: white;
          border-color: #48bb78;
        }

        .filters-section {
          padding: 20px 25px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .search-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input svg {
          position: absolute;
          left: 12px;
          color: #a0aec0;
        }

        .search-input input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .filter-group select,
        .filter-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .clear-filters-btn {
          width: 100%;
          padding: 10px 12px;
          background: #f56565;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters-btn:hover {
          background: #e53e3e;
        }

        .table-container {
          overflow-x: auto;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-table th,
        .invoice-table td {
          padding: 15px 20px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .invoice-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #4a5568;
          position: sticky;
          top: 0;
        }

        .sortable {
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .sortable:hover {
          color: #2d3748;
        }

        .sort-icon {
          transition: transform 0.2s;
        }

        .sort-icon.rotated {
          transform: rotate(180deg);
        }

        .amount-col {
          text-align: right;
        }

        .invoice-number .number {
          font-weight: 600;
          color: #667eea;
          display: block;
        }

        .invoice-number .date {
          font-size: 0.8rem;
          color: #a0aec0;
        }

        .vendor-info .vendor-name {
          font-weight: 500;
          color: #2d3748;
        }

        .vendor-info .vendor-email {
          font-size: 0.8rem;
          color: #a0aec0;
        }

        .department-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #edf2f7;
          color: #4a5568;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          width: fit-content;
        }

        .amount-display .amount {
          font-weight: 700;
          font-size: 1.1rem;
          color: #48bb78;
        }

        .amount-display .tax {
          display: block;
          font-size: 0.8rem;
          color: #a0aec0;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-draft {
          background: #e2e8f0;
          color: #4a5568;
        }
        .status-pending {
          background: #fed7d7;
          color: #c53030;
        }
        .status-approved {
          background: #c6f6d5;
          color: #2f855a;
        }
        .status-rejected {
          background: #fed7d7;
          color: #c53030;
        }
        .status-paid {
          background: #bee3f8;
          color: #2b6cb0;
        }

        .action-dropdown {
          position: relative;
        }

        .dropdown-toggle {
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 160px;
          z-index: 1000;
          display: none;
        }

        .dropdown-toggle:hover + .dropdown-menu,
        .dropdown-menu:hover {
          display: block;
        }

        .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background-color 0.2s;
        }

        .dropdown-menu button:hover {
          background: #f8fafc;
        }

        .dropdown-menu button.success {
          color: #48bb78;
        }
        .dropdown-menu button.danger {
          color: #f56565;
        }
        .dropdown-menu button.warning {
          color: #ed8936;
        }

        .pagination-container {
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 15px;
        }

        .pagination-info {
          color: #718096;
          font-size: 0.9rem;
        }

        .pagination-controls {
          display: flex;
          gap: 5px;
        }

        .pagination-controls button {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .pagination-controls button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e0;
        }

        .pagination-controls button.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .pagination-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 20px 25px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #a0aec0;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          color: #718096;
          background: #f8fafc;
        }

        .modal-body {
          padding: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #4a5568;
        }

        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }

        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .modal-footer {
          padding: 20px 25px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .btn.secondary {
          background: #f8fafc;
          color: #4a5568;
          border-color: #e2e8f0;
        }

        .btn.secondary:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .btn.primary {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .btn.primary:hover:not(:disabled) {
          background: #5a67d8;
          border-color: #5a67d8;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .invoice-management-page {
            padding: 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stats-value {
            font-size: 2rem;
          }

          .invoice-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: center;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .invoice-table {
            font-size: 0.8rem;
          }

          .invoice-table th,
          .invoice-table td {
            padding: 10px;
          }

          .pagination-container {
            flex-direction: column;
            text-align: center;
          }

          .modal-content {
            margin: 20px;
          }
        }

        @media (max-width: 480px) {
          .stats-card {
            flex-direction: column;
            text-align: center;
          }

          .stats-icon {
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicesPage;
