
```
bseb-finance-frontend
├─ .env
├─ .env.development
├─ .env.production
├─ .eslintrc.cjs
├─ .prettierrc
├─ docs
│  ├─ api
│  ├─ components
│  ├─ deployment
│  └─ development
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ assets
│     ├─ documents
│     ├─ icons
│     └─ images
│        ├─ avatars
│        │  └─ bseb-logo.png
│        ├─ backgrounds
│        ├─ illustrations
│        └─ logos
│           ├─ bseb-logo copy.png
│           └─ bseb-logo.png
├─ README.md
├─ src
│  ├─ App copy.jsx
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  ├─ components
│  │  ├─ common
│  │  │  ├─ ErrorBoundary
│  │  │  │  └─ ErrorBoundary.jsx
│  │  │  ├─ Layout
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  ├─ AuthLayout.css
│  │  │  │  ├─ AuthLayout.jsx
│  │  │  │  └─ AuthLayout1.jsx
│  │  │  ├─ Navigation
│  │  │  │  ├─ Sidebar copy 2.jsx
│  │  │  │  ├─ Sidebar copy 2.scss
│  │  │  │  ├─ Sidebar copy.jsx
│  │  │  │  ├─ Sidebar copy.scss
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  ├─ Sidebar.scss
│  │  │  │  └─ TopNavbar.jsx
│  │  │  ├─ ProtectedRoute
│  │  │  │  ├─ ProtectedRoute copy.jsx
│  │  │  │  └─ ProtectedRoute.jsx
│  │  │  ├─ UI
│  │  │  │  ├─ Button
│  │  │  │  │  ├─ Button.jsx
│  │  │  │  │  └─ Button.scss
│  │  │  │  ├─ Cards
│  │  │  │  │  ├─ StatsCard.jsx
│  │  │  │  │  └─ StatsCard.scss
│  │  │  │  ├─ Form
│  │  │  │  │  ├─ FormFileUpload.jsx
│  │  │  │  │  ├─ FormFileUpload.scss
│  │  │  │  │  ├─ FormInput.jsx
│  │  │  │  │  └─ FormSelect.jsx
│  │  │  │  ├─ Loading
│  │  │  │  │  └─ Spinner.jsx
│  │  │  │  └─ Table
│  │  │  │     ├─ DataTable copy.jsx
│  │  │  │     ├─ DataTable.jsx
│  │  │  │     └─ DataTable.scss
│  │  │  └─ UnauthorizedPage.jsx
│  │  └─ features
│  │     ├─ audit
│  │     ├─ auth
│  │     ├─ dashboard
│  │     ├─ departments
│  │     ├─ inflow-funds
│  │     ├─ invoices
│  │     │  └─ InvoiceStatusBadge.jsx
│  │     ├─ outflow-funds
│  │     ├─ payments
│  │     │  ├─ employee-advances
│  │     │  ├─ grants
│  │     │  └─ vendor-payments
│  │     ├─ tally-integration
│  │     ├─ users
│  │     ├─ vendors
│  │     └─ workorders
│  │        ├─ create
│  │        │  ├─ components
│  │        │  ├─ hooks
│  │        │  │  └─ useWorkOrderForm.js
│  │        │  └─ sections
│  │        ├─ detail
│  │        ├─ list
│  │        └─ shared
│  ├─ config
│  │  └─ environment.js
│  ├─ context
│  ├─ hooks
│  │  ├─ api
│  │  │  ├─ useAuth.js
│  │  │  ├─ useDashbaord.js
│  │  │  ├─ useDepartments.js
│  │  │  ├─ useInvoices.js
│  │  │  ├─ useUsers.js
│  │  │  ├─ useVendors.js
│  │  │  └─ useWorkOrders.js
│  │  └─ common
│  │     └─ useDebounce.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ auth
│  │  │  ├─ Login.jsx
│  │  │  ├─ LoginComponent copy.jsx
│  │  │  ├─ LoginComponent.css
│  │  │  ├─ LoginComponent.jsx
│  │  │  └─ LoginForm.jsx
│  │  ├─ dashboard
│  │  │  ├─ Dashboard copy.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ Dashboard.scss
│  │  │  ├─ DashboardStats.jsx
│  │  │  ├─ PaymentSummary.jsx
│  │  │  ├─ PendingApprovals.jsx
│  │  │  ├─ RecentInvoices.jsx
│  │  │  └─ RevenueChart.jsx
│  │  ├─ departments
│  │  │  ├─ DepartmentForm copy.jsx
│  │  │  ├─ DepartmentForm.jsx
│  │  │  ├─ DepartmentsPage copy.jsx
│  │  │  └─ DepartmentsPage.jsx
│  │  ├─ error
│  │  ├─ invoices
│  │  │  ├─ InvoicePage.jsx
│  │  │  └─ InvoicePage.scss
│  │  ├─ payments
│  │  ├─ reports
│  │  ├─ settings
│  │  ├─ users
│  │  │  ├─ CreateUser copy.jsx
│  │  │  ├─ CreateUser.jsx
│  │  │  ├─ EditUser copy.jsx
│  │  │  ├─ EditUser.jsx
│  │  │  ├─ UserForm copy.jsx
│  │  │  ├─ UserForm.jsx
│  │  │  ├─ UsersPage copy.jsx
│  │  │  └─ UsersPage.jsx
│  │  ├─ vendors
│  │  └─ workorders
│  │     ├─ CreateWorkOrder.jsx
│  │     ├─ index.js
│  │     ├─ WorkOrderDetail.jsx
│  │     └─ WorkOrdersList.jsx
│  ├─ routes
│  │  ├─ AppRoutes copy 2.jsx
│  │  ├─ AppRoutes copy.jsx
│  │  └─ AppRoutes.jsx
│  ├─ services
│  │  ├─ api
│  │  │  ├─ auth.js
│  │  │  ├─ client copy.js
│  │  │  ├─ client.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ departments.js
│  │  │  ├─ invoices.js
│  │  │  ├─ users.js
│  │  │  ├─ vendors.js
│  │  │  └─ workorders.js
│  │  ├─ api.js
│  │  ├─ mockData.js
│  │  └─ utils
│  │     ├─ etc
│  │     └─ Validators
│  ├─ store
│  │  ├─ middleware
│  │  ├─ slices
│  │  │  ├─ authSlice copy.js
│  │  │  ├─ authSlice.js
│  │  │  ├─ uiSlice.js
│  │  │  └─ workOrderSlice.js
│  │  └─ store.js
│  ├─ styles
│  │  ├─ etc
│  │  └─ scss
│  │     ├─ abstracts
│  │     │  ├─ _index.scss
│  │     │  ├─ _mixins.scss
│  │     │  └─ _variables.scss
│  │     ├─ base
│  │     │  ├─ _fonts.scss
│  │     │  ├─ _index.scss
│  │     │  ├─ _reset.scss
│  │     │  └─ _typography.scss
│  │     ├─ components
│  │     │  ├─ _buttons.scss
│  │     │  ├─ _cards.scss
│  │     │  ├─ _index.scss
│  │     │  └─ _modals.scss
│  │     ├─ layout
│  │     │  ├─ _footer.scss
│  │     │  ├─ _header.scss
│  │     │  ├─ _index.scss
│  │     │  └─ _sidebar.scss
│  │     ├─ main.scss
│  │     ├─ pages
│  │     │  ├─ _auth.scss
│  │     │  ├─ _dashboard.scss
│  │     │  ├─ _index.scss
│  │     │  ├─ _users copy.scss
│  │     │  └─ _users.scss
│  │     ├─ themes
│  │     │  ├─ _dark.scss
│  │     │  ├─ _index.scss
│  │     │  └─ _light.scss
│  │     └─ utilities
│  │        ├─ _helpers.scss
│  │        ├─ _index.scss
│  │        ├─ _shadows.scss
│  │        └─ _spacing.scss
│  └─ utils
│     ├─ constants
│     │  └─ index.js
│     ├─ helpers
│     │  └─ formatHelpers.js
│     ├─ performance
│     │  └─ lazyLoader.jsx
│     ├─ security
│     └─ validators
│        ├─ authValidation.js
│        ├─ invoiceValidation.js
│        ├─ userValidation.js
│        └─ workOrderValidation.js
├─ tests
│  ├─ components
│  ├─ hooks
│  ├─ services
│  ├─ utils
│  └─ __mocks__
└─ vite.config.js

```