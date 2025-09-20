import React, { useState } from "react";
import EmployeeAttendanceTd from "../tds/EmployeeAttendanceTd";

function EmployeeAttendanceRow({ data, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = () => {
    onEdit(data);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(data);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        {/* Name */}
        <EmployeeAttendanceTd>
          <div className="text-sm font-medium text-gray-900">{data.name}</div>
        </EmployeeAttendanceTd>

        {/* Employee ID */}
        <EmployeeAttendanceTd>
          <span className="text-sm text-gray-700 font-medium">{data.employeeId}</span>
        </EmployeeAttendanceTd>

        {/* Check-In Time */}
        <EmployeeAttendanceTd>
          <span className="text-sm text-gray-700 font-medium">{data.checkInTime}</span>
        </EmployeeAttendanceTd>

        {/* Check-Out Time */}
        <EmployeeAttendanceTd>
          <span className="text-sm text-gray-700 font-medium">{data.checkOutTime}</span>
        </EmployeeAttendanceTd>

        {/* Reason For Late */}
        <EmployeeAttendanceTd>
          <span className={`text-sm ${data.reasonForLate === "--" ? "text-gray-400" : "text-red-600 font-medium"}`}>
            {data.reasonForLate}
          </span>
        </EmployeeAttendanceTd>

        {/* Date */}
        <EmployeeAttendanceTd>
          <div className="text-sm font-medium text-gray-900">{data.date}</div>
        </EmployeeAttendanceTd>

        {/* Early Out Reason */}
        <EmployeeAttendanceTd>
          <span className={`text-sm ${data.earlyOutReason === "--" ? "text-gray-400" : "text-blue-600 font-medium"}`}>
            {data.earlyOutReason}
          </span>
        </EmployeeAttendanceTd>

        {/* Actions */}
        <EmployeeAttendanceTd>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleEditClick}
              className="p-2 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              title="Edit Attendance"
            >
              <img
                src="/icons/fi-sr-pencil.svg"
                alt="Edit"
                className="w-4 h-4 hover:opacity-80"
              />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              title="Delete Attendance"
            >
              <img
                src="/icons/fi-sr-trash.svg"
                alt="Delete"
                className="w-4 h-4 hover:opacity-80"
              />
            </button>
          </div>
        </EmployeeAttendanceTd>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Attendance Record</h3>
                <p className="text-sm text-gray-500">Are you sure you want to delete this attendance record?</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm">
                <p><span className="font-medium">Date:</span> {data.date}</p>
                <p><span className="font-medium">Employee:</span> {data.name} ({data.employeeId})</p>
                <p><span className="font-medium">Check-In:</span> {data.checkInTime}</p>
                <p><span className="font-medium">Check-Out:</span> {data.checkOutTime}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeAttendanceRow;
