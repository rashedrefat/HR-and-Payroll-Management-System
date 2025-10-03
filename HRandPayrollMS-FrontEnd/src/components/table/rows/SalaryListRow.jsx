import PropTypes from "prop-types";
import { useState } from "react";
import SalaryListTd from "../td/SalaryListTd";

export default function SalaryListRow({ data, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(data);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'rejected':
        return 'text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
      <SalaryListTd className="text-center">
        <p className="font-medium text-gray-900">{data.name}</p>
      </SalaryListTd>
      
      <SalaryListTd className="text-center">
        <span className="text-gray-600">{data.employeeId}</span>
      </SalaryListTd>

      <SalaryListTd className="text-center">
        <span className="text-gray-900 font-semibold">{data.monthYear || data.month_year || ''}</span>
      </SalaryListTd>
      
      <SalaryListTd className="text-center font-semibold text-gray-900">
        {formatCurrency(data.salary)}
      </SalaryListTd>
      
      <SalaryListTd className="text-center">
        <span className={getStatusColor(data.status)}>
          {data.status}
        </span>
      </SalaryListTd>
      
      <SalaryListTd className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            type="button"
            onClick={handleEditClick}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            title="Edit"
          >
            <img 
              src="/icons/fi-sr-pencil.svg" 
              alt="Edit" 
              className="w-4 h-4"
            />
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
            title="Delete"
          >
            <img 
              src="/icons/fi-sr-trash.svg" 
              alt="Delete" 
              className="w-4 h-4"
            />
          </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Payslip Record</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the payslip record for "{data?.name}"? This action cannot be undone and will permanently remove this payslip record from the system.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </SalaryListTd>
    </tr>
  );
}

SalaryListRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    salary: PropTypes.number.isRequired,
    adjustmentAmount: PropTypes.number.isRequired,
    adjustmentReason: PropTypes.string.isRequired,
    afterAdjustmentSalary: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
