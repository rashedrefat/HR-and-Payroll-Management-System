import PropTypes from "prop-types";
import { useState } from "react";
import TableData from "../td/TableData";
import AttendanceListTd from "../td/AttendanceListTd";

export default function AttendanceListRow({ selectRow, selectedData, data, onEdit, onDelete }) {
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
  return (
    <tr className="hover:bg-gray-50">
      <TableData className="text-left">
        <AttendanceListTd
          data={data.name}
          selectRow={selectRow}
          selectedData={selectedData}
        />
      </TableData>
      <TableData>
        <span className="text-gray-600 font-medium">{data.employeeId}</span>
      </TableData>
      <TableData>
        <span className="text-blue-600 font-medium text-sm">{data.shift}</span>
      </TableData>
      <TableData>
        <span className="text-green-600 font-medium">{data.checkInTime}</span>
      </TableData>
      <TableData>
        <span className="text-red-600 font-medium">{data.checkOutTime}</span>
      </TableData>
      <TableData>
        <div className="flex flex-col space-y-1">
          {data.status?.isLate && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Late ({data.status.lateMinutes} min)
            </span>
          )}
          {data.status?.isEarlyOut && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Early Out ({data.status.earlyOutMinutes} min)
            </span>
          )}
          {!data.status?.isLate && !data.status?.isEarlyOut && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Time
            </span>
          )}
        </div>
      </TableData>
      <TableData>
        <span className="text-gray-600">{new Date(data.date).toLocaleDateString('en-GB')}</span>
      </TableData>
      <TableData>
        <div className="flex items-center gap-3 justify-center">
          <button 
            onClick={handleEditClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            title="Edit Attendance"
          >
            <img src="/icons/fi-sr-pencil.svg" alt="Edit" className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            title="Delete Attendance"
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
                  <h3 className="text-lg font-medium text-gray-900">Delete Attendance Record</h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this attendance record for <strong>{data.name.title}</strong>? This action cannot be undone and will permanently remove the attendance data.
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

AttendanceListRow.propTypes = {
  data: PropTypes.object.isRequired,
  selectRow: PropTypes.func,
  selectedData: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
