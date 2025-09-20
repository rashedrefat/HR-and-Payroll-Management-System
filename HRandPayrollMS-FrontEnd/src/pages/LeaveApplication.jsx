import React from 'react';

// Removed duplicate LeaveApplication component and default export
import Table from "../components/table/Table";
import { useState } from "react";
import AllEmployeeRow from "../components/table/rows/LeaveApplicationRow";
import { 
  useGetLeaveRequestsQuery,
  useUpdateLeaveRequestStatusMutation,
  useDeleteLeaveRequestMutation
} from "../features/leave/leaveRequestApiSlice";

const tableLabels = [
  { title: "Name", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Start Date", sort: true },
  { title: "End Date", sort: true },
  { title: "Days", sort: true },
  { title: "Leave Reason", sort: true },
  { title: "Status", sort: true },
  { title: "Action", sort: false },
];

export default function LeaveApplication() {
  // API hooks
  const { 
    data: leaveRequestsData = [], 
    isLoading, 
    error 
  } = useGetLeaveRequestsQuery();
  
  const [updateLeaveRequestStatus] = useUpdateLeaveRequestStatusMutation();
  const [deleteLeaveRequest] = useDeleteLeaveRequestMutation();
  
  const [select, setSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  // Transform API data to match table format
  const tableData = leaveRequestsData.map(request => ({
    id: request.id,
    name: {
      title: request.name,
      image: request.employee?.image || "/images/profile-photo.jpg", // Use employee's actual image or fallback
      visibleCheckbox: true,
    },
    employeeId: request.employee?.employee_id || `EMP-${String(request.employee_id).padStart(5, '0')}`, // Use actual employee_id or fallback
    startDate: new Date(request.start_date).toLocaleDateString('en-GB'), // DD-MM-YYYY format
    endDate: new Date(request.end_date).toLocaleDateString('en-GB'),
    leaveCount: request.days.toString(),
    leaveReason: request.leave_type,
    status: request.status === 'rejected' ? 'Rejected' : request.status.charAt(0).toUpperCase() + request.status.slice(1), // Handle rejected status display
  }));

  // Filter table data based on search term and status
  const filteredData = tableData.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Text search filter
    const matchesSearch = !searchTerm || (
      employee.name.title.toLowerCase().includes(searchLower) ||
      employee.employeeId.toLowerCase().includes(searchLower) ||
      employee.leaveReason.toLowerCase().includes(searchLower)
    );

    // Status filter
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Function to handle delete request
  const handleDeleteRequest = async (id) => {
    setDeleteRequestId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveRequest(deleteRequestId).unwrap();
      setShowDeleteModal(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error('Failed to delete leave request:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRequestId(null);
  };

  // Function to handle edit request
  const handleEditRequest = (requestData) => {
    // Convert display status back to database format for editing
    const dbStatus = requestData.status.toLowerCase() === 'rejected' ? 'rejected' : requestData.status.toLowerCase();
    setEditingRequest({...requestData, status: dbStatus});
    setShowEditModal(true);
  };

  const resetSelection = () => {
    setSelect([]);
    setShowBulkActions(false);
  };

  // Function to update a single record via API
  const updateRecord = async (id, field, value) => {
    try {
      if (field === 'status') {
        // Map display status back to API format
        const apiStatus = value.toLowerCase();
        await updateLeaveRequestStatus({
          id,
          status: apiStatus
        }).unwrap();
      }
      // Note: leaveCount updates would require backend support for updating days
    } catch (error) {
      console.error('Failed to update leave request:', error);
      alert('Failed to update leave request: ' + (error.data?.message || error.message));
    }
  };

  // Function to update multiple records via API
  const updateMultipleRecords = async (ids, updates) => {
    try {
      const promises = ids.map(id => 
        updateLeaveRequestStatus({
          id,
          status: updates.status.toLowerCase()
        }).unwrap()
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to update multiple leave requests:', error);
      alert('Failed to update leave requests: ' + (error.data?.message || error.message));
    }
  };

  const handleSelect = (item, e) => {
    if (e.target.checked) {
      const newSelection = [...select, item];
      setSelect(newSelection);
      setShowBulkActions(newSelection.length > 0);
    } else {
      const newSelection = select.filter((data) => item !== data);
      setSelect(newSelection);
      setShowBulkActions(newSelection.length > 0);
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelect(filteredData.map((data) => data.id));
      setShowBulkActions(true);
    } else {
      resetSelection();
    }
  };

  const handleBulkApprove = async () => {
    await updateMultipleRecords(select, { status: "approved" });
    console.log("Approving selected applications:", select);
    alert(`${select.length} leave applications approved!`);
    resetSelection();
  };

  const handleBulkDecline = async () => {
    if (window.confirm(`Are you sure you want to decline ${select.length} selected applications?`)) {
      await updateMultipleRecords(select, { status: "rejected" });
      console.log("Declining selected applications:", select);
      alert(`${select.length} leave applications declined!`);
      resetSelection();
    }
  };

  // Calculate statistics
  const stats = {
    total: tableData.length,
    approved: tableData.filter(app => app.status === "Approved").length,
    declined: tableData.filter(app => app.status === "Rejected").length,
    pending: tableData.filter(app => app.status === "Pending").length,
    totalDays: tableData.reduce((sum, app) => sum + parseInt(app.leaveCount || 0), 0),
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading leave requests...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading leave requests: {error.message}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Leave Application</h1>
          <p className="text-gray-600 mt-1">Review and manage employee leave requests</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img 
              src="/icons/search-icon.svg" 
              alt="Search" 
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg shadow p-4 border-l-4 border-yellow-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-gray-900">{stats.declined}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {stats.total} applications
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-blue-800 font-medium">{select.length} application(s) selected</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Selected
              </button>
              <button
                onClick={handleBulkDecline}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Decline Selected
              </button>
              <button
                onClick={resetSelection}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table
          selectAll={selectAll}
          selectRow={handleSelect}
          selectedData={select}
          dataSet={filteredData.length}
          tableLabels={tableLabels}
          itemsPerPage={10}
          resetSelection={resetSelection}
        >
          {filteredData.map((data) => (
            <AllEmployeeRow
              key={data.id}
              data={data}
              selectedData={select}
              selectRow={handleSelect}
              updateRecord={updateRecord}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
          ))}
        </Table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRequest && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Edit Leave Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee: {editingRequest.name.title}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type: {editingRequest.leaveReason}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration: {editingRequest.startDate} to {editingRequest.endDate} ({editingRequest.leaveCount} days)
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingRequest.status}
                  onChange={(e) => {
                    updateRecord(editingRequest.id, 'status', e.target.value);
                    setEditingRequest({...editingRequest, status: e.target.value});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
                <h3 className="text-lg font-medium text-gray-900">Delete Leave Request</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this leave request? This action cannot be undone and will permanently remove the leave request data.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Removed duplicate default export