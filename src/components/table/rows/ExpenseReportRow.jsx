import React from "react";
import PropTypes from "prop-types";
import AllEmployeeTd from "../td/AllemployeeTd";
import TableData from "../td/TableData";

const ExpenseReportRow = ({ data, selectedData, selectRow }) => {
  const {
    name,
    employeeId,
    department,
    expenseType,
    amount,
    submittedDate,
    approvalDate,
    status,
    description,
    receiptAttached,
    currency,
  } = data;

  // Determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return "text-green-600 bg-green-100";
      case 'pending':
        return "text-yellow-600 bg-yellow-100";
      case 'declined':
        return "text-red-600 bg-red-100";
      case 'under review':
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'BDT') => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get expense type color
  const getExpenseTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'travel':
        return "text-blue-700 bg-blue-100";
      case 'office supplies':
        return "text-purple-700 bg-purple-100";
      case 'equipment':
        return "text-indigo-700 bg-indigo-100";
      case 'meals & entertainment':
        return "text-orange-700 bg-orange-100";
      case 'training':
        return "text-green-700 bg-green-100";
      case 'software':
        return "text-cyan-700 bg-cyan-100";
      case 'office rent':
        return "text-red-700 bg-red-100";
      case 'advertising':
        return "text-pink-700 bg-pink-100";
      case 'utilities':
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Employee Name with Image and Checkbox */}
      <TableData className="text-left min-w-[200px]">
        <AllEmployeeTd data={name} selectedData={selectedData} selectRow={selectRow} />
      </TableData>

      {/* Employee ID */}
      <TableData className="text-sm font-mono text-gray-700 min-w-[120px]">
        <span className="px-2 py-1 bg-gray-50 rounded text-gray-600">
          {employeeId}
        </span>
      </TableData>

      {/* Expense Type */}
      <TableData className="text-sm text-gray-700 min-w-[140px]">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExpenseTypeColor(expenseType)}`}>
          {expenseType}
        </span>
      </TableData>

      {/* Amount */}
      <TableData className="text-sm font-bold text-right text-gray-900 min-w-[120px]">
        <span className="px-3 py-1 bg-green-50 border border-green-200 rounded font-mono text-green-700">
          {formatCurrency(amount, currency)}
        </span>
      </TableData>

      {/* Department */}
      <TableData className="text-sm text-gray-700 min-w-[130px]">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {department}
        </span>
      </TableData>

      {/* Submitted Date */}
      <TableData className="text-sm text-gray-700 min-w-[120px]">
        <span className="text-gray-600">
          {formatDate(submittedDate)}
        </span>
      </TableData>

      {/* Status */}
      <TableData className="text-sm font-medium text-center min-w-[110px]">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      </TableData>

      {/* Approval Date */}
      <TableData className="text-sm text-gray-700 min-w-[120px]">
        <span className="text-gray-600">
          {formatDate(approvalDate)}
        </span>
      </TableData>

      {/* Description */}
      <TableData className="text-sm text-gray-700 min-w-[200px] max-w-[200px]">
        <div className="truncate" title={description}>
          {description}
        </div>
      </TableData>

      {/* Receipt */}
      <TableData className="text-sm text-center min-w-[80px]">
        {receiptAttached ? (
          <div className="flex items-center justify-center">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              ✓ Yes
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
              ✗ No
            </span>
          </div>
        )}
      </TableData>

      {/* Actions */}
      <TableData className="min-w-[120px]">
        <div className="flex items-center gap-3 justify-center">
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors" title="Edit Expense">
            <img src="/icons/fi-sr-pencil.svg" alt="Edit" className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-blue-50 rounded-full transition-colors" title="View Receipt">
            <img src="/icons/download.svg" alt="Receipt" className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-red-50 rounded-full transition-colors" title="Delete">
            <img
              src="/icons/fi-sr-trash.svg"
              alt="Delete"
              className="w-5 h-5"
            />
          </button>
        </div>
      </TableData>
    </tr>
  );
};

ExpenseReportRow.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.object.isRequired,
    employeeId: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    expenseType: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    submittedDate: PropTypes.string.isRequired,
    approvalDate: PropTypes.string,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    receiptAttached: PropTypes.bool.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
  selectedData: PropTypes.array.isRequired,
  selectRow: PropTypes.func.isRequired,
};

export default ExpenseReportRow;
