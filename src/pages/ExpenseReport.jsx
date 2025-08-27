import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../components/hooks/useDebounce";
import Table from "../components/table/Table";
import ExpenseReportRow from "../components/table/rows/ExpenseReportRow";
import IconButton from "../components/buttons/IconButton";

// Table headers for expense report
const tableLabels = [
  { title: "Employee", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Expense Type", sort: true },
  { title: "Amount", sort: true },
  { title: "Department", sort: true },
  { title: "Submitted Date", sort: true },
  { title: "Status", sort: true },
  { title: "Approval Date", sort: true },
  { title: "Description", sort: false },
  { title: "Receipt", sort: false },
  { title: "Action", sort: false },
];

// Expense report data with comprehensive expense tracking information
const initialExpenseData = [
  {
    id: 1,
    name: {
      title: "Rashedul Islam",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: 1,
    },
    employeeId: "EMP-82382",
    department: "Web Development",
    expenseType: "Travel",
    amount: 12500.00,
    submittedDate: "2025-08-20",
    approvalDate: "2025-08-22",
    status: "Approved",
    description: "Client meeting transportation",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Paid",
    currency: "BDT"
  },
  {
    id: 2,
    name: {
      title: "Rifat Bandhan",
      image: "/images/bandhan-pic.jpg",
      visibleCheckbox: true,
      id: 2,
    },
    employeeId: "EMP-33923",
    department: "Marketing",
    expenseType: "Office Supplies",
    amount: 8500.50,
    submittedDate: "2025-08-21",
    approvalDate: null,
    status: "Pending",
    description: "Stationery and printing materials",
    receiptAttached: true,
    approvedBy: null,
    reimbursementStatus: "Pending",
    currency: "BDT"
  },
  {
    id: 3,
    name: {
      title: "Sadia Afrin",
      image: "/images/sadia-pic.jpg",
      visibleCheckbox: true,
      id: 3,
    },
    employeeId: "EMP-13445",
    department: "HR",
    expenseType: "Equipment",
    amount: 21000.00,
    submittedDate: "2025-08-19",
    approvalDate: "2025-08-20",
    status: "Declined",
    description: "Laptop and accessories",
    receiptAttached: false,
    approvedBy: "Director",
    reimbursementStatus: "N/A",
    currency: "BDT"
  },
  {
    id: 4,
    name: {
      title: "Shahariar Islam",
      image: "/images/shahriar-pic.jpg",
      visibleCheckbox: true,
      id: 4,
    },
    employeeId: "EMP-42452",
    department: "Sales",
    expenseType: "Meals & Entertainment",
    amount: 6750.25,
    submittedDate: "2025-08-22",
    approvalDate: "2025-08-23",
    status: "Approved",
    description: "Client dinner meeting",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Processing",
    currency: "BDT"
  },
  {
    id: 5,
    name: {
      title: "Mazaharul Auntu",
      image: "/images/auntu-pic.jpg",
      visibleCheckbox: true,
      id: 5,
    },
    employeeId: "EMP-24422",
    department: "IT",
    expenseType: "Training",
    amount: 18000.75,
    submittedDate: "2025-08-18",
    approvalDate: null,
    status: "Pending",
    description: "Software development course",
    receiptAttached: true,
    approvedBy: null,
    reimbursementStatus: "Pending",
    currency: "BDT"
  },
  {
    id: 6,
    name: {
      title: "Lina Rahman",
      image: "/images/lina-pic.jpg",
      visibleCheckbox: true,
      id: 6,
    },
    employeeId: "EMP-42332",
    department: "Design",
    expenseType: "Software",
    amount: 9500.00,
    submittedDate: "2025-08-23",
    approvalDate: "2025-08-24",
    status: "Approved",
    description: "Adobe Creative Suite license",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Paid",
    currency: "BDT"
  },
  {
    id: 7,
    name: {
      title: "Ahmed Hassan",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: 7,
    },
    employeeId: "EMP-55521",
    department: "Operations",
    expenseType: "Travel",
    amount: 13500.00,
    submittedDate: "2025-08-17",
    approvalDate: "2025-08-19",
    status: "Declined",
    description: "International conference attendance",
    receiptAttached: false,
    approvedBy: "Director",
    reimbursementStatus: "N/A",
    currency: "BDT"
  },
  {
    id: 8,
    name: {
      title: "Fatima Khan",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: 8,
    },
    employeeId: "EMP-76543",
    department: "Finance",
    expenseType: "Office Rent",
    amount: 45000.00,
    submittedDate: "2025-08-15",
    approvalDate: "2025-08-16",
    status: "Approved",
    description: "Monthly office space rental",
    receiptAttached: true,
    approvedBy: "CFO",
    reimbursementStatus: "Paid",
    currency: "BDT"
  },
  {
    id: 9,
    name: {
      title: "Rakib Ahmed",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: 9,
    },
    employeeId: "EMP-98765",
    department: "Marketing",
    expenseType: "Advertising",
    amount: 25000.00,
    submittedDate: "2025-08-14",
    approvalDate: null,
    status: "Under Review",
    description: "Social media campaign budget",
    receiptAttached: true,
    approvedBy: null,
    reimbursementStatus: "Pending",
    currency: "BDT"
  },
  {
    id: 10,
    name: {
      title: "Nadia Islam",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: 10,
    },
    employeeId: "EMP-11223",
    department: "HR",
    expenseType: "Utilities",
    amount: 8750.50,
    submittedDate: "2025-08-25",
    approvalDate: "2025-08-26",
    status: "Approved",
    description: "Office electricity and internet",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Processing",
    currency: "BDT"
  }
];

const ExpenseReport = () => {
  const [expenseData, setExpenseData] = useState(initialExpenseData);
  const [selectedData, setSelectedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("all");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get unique values for filters
  const departments = [...new Set(expenseData.map(item => item.department))];
  const expenseTypes = [...new Set(expenseData.map(item => item.expenseType))];
  const statuses = [...new Set(expenseData.map(item => item.status))];

  // Filter data based on search and filters
  const filteredData = expenseData.filter(expense => {
    const matchesSearch = 
      expense.name.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      expense.employeeId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      expense.expenseType.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || expense.department === departmentFilter;
    const matchesExpenseType = expenseTypeFilter === "all" || expense.expenseType === expenseTypeFilter;
    
    const matchesAmountRange = 
      (!amountRange.min || expense.amount >= parseFloat(amountRange.min)) &&
      (!amountRange.max || expense.amount <= parseFloat(amountRange.max));

    return matchesSearch && matchesStatus && matchesDepartment && matchesExpenseType && matchesAmountRange;
  });

  // Calculate statistics
  const totalExpenses = filteredData.length;
  const totalAmount = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredData.filter(expense => expense.status === "Approved").length;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  // Handle row selection
  const selectRow = (id) => {
    setSelectedData(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle bulk actions
  const handleBulkApprove = () => {
    setExpenseData(prev => 
      prev.map(expense => 
        selectedData.includes(expense.id) 
          ? { ...expense, status: "Approved", approvalDate: new Date().toISOString().split('T')[0] }
          : expense
      )
    );
    setSelectedData([]);
  };

  const handleBulkReject = () => {
    setExpenseData(prev => 
      prev.map(expense => 
        selectedData.includes(expense.id) 
          ? { ...expense, status: "Declined", approvalDate: new Date().toISOString().split('T')[0] }
          : expense
      )
    );
    setSelectedData([]);
  };

  const handleBulkDelete = () => {
    setExpenseData(prev => prev.filter(expense => !selectedData.includes(expense.id)));
    setSelectedData([]);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setExpenseTypeFilter("all");
    setAmountRange({ min: "", max: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link to="/dashboard" className="hover:text-red-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/reports" className="hover:text-red-600 transition-colors">
            Reports
          </Link>
          <span>/</span>
          <span className="text-red-600 font-medium">Expense Reports</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Expense Reports</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive expense tracking and analysis
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <h3 className="text-2xl font-bold">{totalExpenses}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <img src="/icons/expense.svg" alt="Expenses" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalAmount)}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <img src="/icons/money.svg" alt="Amount" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Approved</p>
              <h3 className="text-2xl font-bold">{approvedExpenses}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <img src="/icons/present.svg" alt="Approved" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold">{filteredData.filter(expense => expense.status === "Pending").length}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <img src="/icons/timeline.svg" alt="Pending" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <img 
                src="/icons/search-icon.svg" 
                alt="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, ID, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Expense Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type
            </label>
            <select
              value={expenseTypeFilter}
              onChange={(e) => setExpenseTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {expenseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Amount Range */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Amount (৳)
            </label>
            <input
              type="number"
              placeholder="0"
              value={amountRange.min}
              onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Amount (৳)
            </label>
            <input
              type="number"
              placeholder="100000"
              value={amountRange.max}
              onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedData.length} expense(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reject Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Expense List ({filteredData.length})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <IconButton className="bg-green-600 hover:bg-green-700 text-white">
            <img src="/icons/export.svg" alt="Export" className="w-5 h-5" />
            Export Data
          </IconButton>
          <IconButton className="bg-red-600 hover:bg-red-700 text-white">
            <img src="/icons/plus-Icon.svg" alt="Add" className="w-5 h-5" />
            Add Expense
          </IconButton>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table labels={tableLabels}>
              {filteredData.map((expense, index) => (
                <ExpenseReportRow
                  key={expense.id}
                  data={{
                    serial: index + 1,
                    ...expense
                  }}
                  selectedData={selectedData}
                  selectRow={selectRow}
                />
              ))}
            </Table>
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <img 
              src="/icons/expense.svg" 
              alt="No expenses" 
              className="w-16 h-16 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg font-medium">No expenses found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseReport;
