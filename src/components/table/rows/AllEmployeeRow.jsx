import PropTypes from "prop-types";
import TableData from "../td/TableData";
import AllEmployeeTd from "../td/AllemployeeTd";
import { useState } from "react";

export default function AllEmployeeRow({ selectRow, selectedData, data, updateEmployeeStatus, onEdit, onDelete }) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleStatusChange = (newStatus) => {
    updateEmployeeStatus(data.id, newStatus);
    setIsEditingStatus(false);
  };

  // Handler functions for edit and delete actions
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
  return (
    <tr className="hover:bg-gray-50">
      <TableData className="text-left">
        <AllEmployeeTd
          data={{...data.name, id: data.id}}
          selectRow={(nameData, e) => selectRow(data, e)}
          selectedData={selectedData}
        />
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.email}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.employeeId}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.mobile}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.department}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.designation}</span>
      </TableData>
      <TableData>
        {isEditingStatus ? (
          <select
            defaultValue={data.status}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleStatusChange(e.target.value)}
            onBlur={() => setIsEditingStatus(false)}
            autoFocus
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        ) : (
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer border ${getStatusColor(data.status)}`}
            onClick={() => setIsEditingStatus(true)}
            title="Click to edit"
          >
            {data.status}
          </span>
        )}
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.joiningDate}</span>
      </TableData>
      <TableData>
        <div className="flex items-center gap-3 justify-center">
          <button 
            onClick={handleEditClick}
            className="p-2 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            title="Edit Employee"
          >
            <img src="/icons/fi-sr-pencil.svg" alt="Edit" className="w-4 h-4 hover:opacity-80" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            title="Delete Employee"
          >
            <img
              src="/icons/fi-sr-trash.svg"
              alt="Delete"
              className="w-4 h-4 hover:opacity-80"
            />
          </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Employee</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete employee "{data?.name?.title}"? This action cannot be undone and will permanently remove all employee data.
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
      </TableData>
    </tr>
  );
}

AllEmployeeRow.propTypes = {
  data: PropTypes.object.isRequired,
  selectRow: PropTypes.func,
  selectedData: PropTypes.array,
  updateEmployeeStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
