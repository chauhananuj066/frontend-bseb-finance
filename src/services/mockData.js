// Mock data for development
export const mockDashboardData = {
  stats: {
    totalInvoices: 1247,
    totalAmount: 15750000,
    pendingApprovals: 23,
    processedPayments: 856,
    activeVendors: 145,
    completedOrders: 432,
    monthlyGrowth: 12.5,
    paymentGrowth: -3.2,
  },

  recentInvoices: [
    {
      id: 1,
      invoice_no: 'INV-2024-001',
      vendor_name: 'ABC Electronics Ltd',
      amount: 125000,
      due_date: '2024-01-15',
      status: 1,
      created_at: '2024-01-01',
    },
    {
      id: 2,
      invoice_no: 'INV-2024-002',
      vendor_name: 'XYZ Construction',
      amount: 750000,
      due_date: '2024-01-20',
      status: 2,
      created_at: '2024-01-02',
    },
  ],

  pendingApprovals: [
    {
      id: 1,
      type: 'invoice',
      title: 'Invoice INV-2024-006',
      description: 'Electrical Equipment Purchase',
      amount: 450000,
      submittedBy: 'John Doe',
      submittedAt: '2024-01-10T10:30:00Z',
      priority: 'high',
    },
  ],

  revenueChart: [
    { month: 'Jul', revenue: 2400000, expenses: 1800000, profit: 600000 },
    { month: 'Aug', revenue: 2800000, expenses: 2100000, profit: 700000 },
    { month: 'Sep', revenue: 3200000, expenses: 2300000, profit: 900000 },
    { month: 'Oct', revenue: 2900000, expenses: 2200000, profit: 700000 },
    { month: 'Nov', revenue: 3500000, expenses: 2600000, profit: 900000 },
    { month: 'Dec', revenue: 4100000, expenses: 2800000, profit: 1300000 },
  ],

  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@bseb.gov.in',
      role: 'admin',
      department: 'IT Department',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      username: 'manager1',
      email: 'manager1@bseb.gov.in',
      role: 'manager',
      department: 'Finance Department',
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      username: 'accountant1',
      email: 'accountant1@bseb.gov.in',
      role: 'accountant',
      department: 'Accounts Department',
      created_at: '2024-01-03T00:00:00Z',
    },
    {
      id: 4,
      username: 'clerk1',
      email: 'clerk1@bseb.gov.in',
      role: 'clerk',
      department: 'General Administration',
      created_at: '2024-01-04T00:00:00Z',
    },
  ],

  Departments: [
    {
      id: 1,
      department_name: 'IT Department',
      created_by: 'System Admin',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      department_name: 'Finance Department',
      created_by: 'System Admin',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      department_name: 'Accounts Department',
      created_by: 'System Admin',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      department_name: 'General Administration',
      created_by: 'System Admin',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      department_name: 'Technical Department',
      created_by: 'System Admin',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
};

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@bseb.gov.in',
    role: 'admin',
    department: 'IT Department',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'manager1',
    email: 'manager1@bseb.gov.in',
    role: 'manager',
    department: 'Finance Department',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'accountant1',
    email: 'accountant1@bseb.gov.in',
    role: 'accountant',
    department: 'Accounts Department',
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 4,
    username: 'clerk1',
    email: 'clerk1@bseb.gov.in',
    role: 'clerk',
    department: 'General Administration',
    created_at: '2024-01-04T00:00:00Z',
  },
];

export const mockDepartments = [
  {
    id: 1,
    department_name: 'IT Department',
    created_by: 'System Admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    department_name: 'Finance Department',
    created_by: 'System Admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    department_name: 'Accounts Department',
    created_by: 'System Admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    department_name: 'General Administration',
    created_by: 'System Admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    department_name: 'Technical Department',
    created_by: 'System Admin',
    created_at: '2024-01-01T00:00:00Z',
  },
];
