import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import { useState } from "react";
import ExpenseReportsRow from "../components/table/rows/ExpenseReportsRow";
import IconButton from "../components/buttons/IconButton";
import { useDebounce } from "../components/hooks/useDebounce";

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

const initialExpenseData = [
  {
    id: 1,
    name: {
      id: 1,
      title: "Rashedul Islam",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-82382",
    department: "Web Development",
    expenseType: "Travel",
    amount: 12500.00,
    submittedDate: "2025-08-20",
    approvalDate: "2025-08-22",
    status: "Approved",
    description: "Client meeting transportation costs",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Paid",
    currency: "BDT"
  },
  {
    id: 2,
    name: {
      id: 2,
      title: "Rifat Bandhan",
      image: "/images/bandhan-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-33923",
    department: "Marketing",
    expenseType: "Office Supplies",
    amount: 8500.50,
    submittedDate: "2025-08-21",
    approvalDate: null,
    status: "Pending",
    description: "Stationery and printing materials for office use",
    receiptAttached: true,
    approvedBy: null,
    reimbursementStatus: "Pending",
    currency: "BDT"
  },
  {
    id: 3,
    name: {
      id: 3,
      title: "Sadia Afrin",
      image: "/images/sadia-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-13445",
    department: "HR",
    expenseType: "Equipment",
    amount: 21000.00,
    submittedDate: "2025-08-19",
    approvalDate: "2025-08-20",
    status: "Declined",
    description: "New laptop and accessories for workstation",
    receiptAttached: false,
    approvedBy: "Director",
    reimbursementStatus: "N/A",
    currency: "BDT"
  },
  {
    id: 4,
    name: {
      id: 4,
      title: "Shahariar Islam",
      image: "/images/shahriar-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-42452",
    department: "Sales",
    expenseType: "Meals & Entertainment",
    amount: 6750.25,
    submittedDate: "2025-08-22",
    approvalDate: "2025-08-23",
    status: "Approved",
    description: "Client dinner meeting at premium restaurant",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Processing",
    currency: "BDT"
  },
  {
    id: 5,
    name: {
      id: 5,
      title: "Mazaharul Auntu",
      image: "/images/auntu-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-24422",
    department: "IT",
    expenseType: "Training",
    amount: 18000.75,
    submittedDate: "2025-08-18",
    approvalDate: null,
    status: "Under Review",
    description: "Advanced software development certification course",
    receiptAttached: true,
    approvedBy: null,
    reimbursementStatus: "Pending",
    currency: "BDT"
  },
  {
    id: 6,
    name: {
      id: 6,
      title: "Lina Rahman",
      image: "/images/lina-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-42332",
    department: "Design",
    expenseType: "Software",
    amount: 9500.00,
    submittedDate: "2025-08-23",
    approvalDate: "2025-08-24",
    status: "Approved",
    description: "Adobe Creative Suite license renewal",
    receiptAttached: true,
    approvedBy: "Manager",
    reimbursementStatus: "Paid",
    currency: "BDT"
  }
];

export default function ExpenseReports() {
  const [expenseData, setExpenseData] = useState(initialExpenseData);
  const [selectedData, setSelectedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("all");

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

    return matchesSearch && matchesStatus && matchesDepartment && matchesExpenseType;
  });

  // Calculate statistics
  const totalExpenses = filteredData.length;
  const totalAmount = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredData.filter(expense => expense.status === "Approved").length;
  const pendingExpenses = filteredData.filter(expense => expense.status === "Pending").length;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  // Handle row selection
  const selectRow = (id, e) => {
    if (e.target.checked) {
      setSelectedData((prev) => [...prev, id]);
    } else {
      setSelectedData((prev) => prev.filter((item) => item !== id));
    }
  };

  // Handle select all
  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedData(filteredData.map(expense => expense.id));
    } else {
      setSelectedData([]);
    }
  };

  // Reset selection
  const resetSelection = () => {
    setSelectedData([]);
  };

  // Update expense status
  const updateExpenseStatus = (id, newStatus) => {
    setExpenseData(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { 
              ...expense, 
              status: newStatus, 
              approvalDate: newStatus !== "Pending" ? new Date().toISOString().split('T')[0] : null 
            }
          : expense
      )
    );
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
          Comprehensive expense tracking and management system
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
              <img src="/icons/expense.svg" alt="Expenses" className="w-8 h-8 filter brightness-0 invert" />
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
              <img src="/icons/money.svg" alt="Amount" className="w-8 h-8 filter brightness-0 invert" />
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
              <img src="/icons/present.svg" alt="Approved" className="w-8 h-8 filter brightness-0 invert" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold">{pendingExpenses}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <img src="/icons/timeline.svg" alt="Pending" className="w-8 h-8 filter brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Expenses
            </label>
            <div className="relative">
              <img 
                src="/icons/search-icon.svg" 
                alt="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by employee, ID, description..."
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
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Clear All Filters
          </button>
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
            All Expenses ({filteredData.length})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <IconButton 
            className="bg-green-600 hover:bg-green-700 text-white"
            icon="/icons/export.svg"
            text="Export Data"
          />
          <IconButton 
            className="bg-red-600 hover:bg-red-700 text-white"
            icon="/icons/plus-Icon.svg"
            text="Add New Expense"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="min-w-[1400px]">
          <Table 
            selectAll={selectAll}
            selectRow={selectRow}
            selectedData={selectedData}
            dataSet={filteredData.length}
            tableLabels={tableLabels}
            itemsPerPage={10}
            resetSelection={resetSelection}
          >
            {filteredData.map((expense) => (
              <ExpenseReportsRow
                key={expense.id}
                data={expense}
                selectRow={selectRow}
                selectedData={selectedData}
                updateExpenseStatus={updateExpenseStatus}
              />
            ))}
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <img 
              src="/icons/expense.svg" 
              alt="No expenses" 
              className="w-16 h-16 mx-auto mb-4 opacity-50 filter grayscale"
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
}
