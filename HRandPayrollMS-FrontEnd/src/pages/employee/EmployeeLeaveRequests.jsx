import React, { useState, useMemo } from "react";
import {
  useGetMyLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
} from "../../features/leave/leaveRequestApiSlice";
import {
  useGetLeaveTypesQuery,
} from "../../features/api/leaveTypeApi";
import { useCurrentEmployee } from "../../components/hooks/useCurrentEmployee";

export default function EmployeeLeaveRequests() {
  // All hooks must be declared before any early returns
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [newRequest, setNewRequest] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: ""
  });
  
  // API hooks with comprehensive error handling
  const { 
    data: leaveRequests = [], 
    isLoading, 
    error,
    refetch: refetchLeaveRequests
  } = useGetMyLeaveRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    retry: 3,
    retryDelay: 1000,
  });
  
  const { 
    data: leaveTypes = [],
    isLoading: isLoadingLeaveTypes,
    error: leaveTypesError,
    refetch: refetchLeaveTypes
  } = useGetLeaveTypesQuery(undefined, {
    retry: 3,
    retryDelay: 1000,
  });

  const [createLeaveRequest] = useCreateLeaveRequestMutation();
  const [updateLeaveRequest] = useUpdateLeaveRequestMutation();
  const [deleteLeaveRequest] = useDeleteLeaveRequestMutation();

  // Get current employee info including gender
  const { gender } = useCurrentEmployee();

  // Filter leave types based on gender
  const filteredLeaveTypes = useMemo(() => {
    if (!leaveTypes.length || !gender) return leaveTypes;
    
    return leaveTypes.filter(leaveType => {
      const leaveTypeLower = leaveType.leave_type?.toLowerCase() || '';
      
      // Male employees cannot apply for maternity leave
      if (gender.toLowerCase() === 'male' && leaveTypeLower.includes('maternity')) {
        return false;
      }
      
      // Female employees cannot apply for paternity leave
      if (gender.toLowerCase() === 'female' && leaveTypeLower.includes('paternity')) {
        return false;
      }
      
      return true;
    });
  }, [leaveTypes, gender]);

  // Calculate remaining leave days for each leave type (using filtered leave types)
  const remainingLeaveDays = useMemo(() => {
    if (!filteredLeaveTypes.length || !leaveRequests.length) return {};
    
    console.log('Leave Requests Data:', leaveRequests);
    console.log('Filtered Leave Types Data:', filteredLeaveTypes);
    
    const remaining = {};
    
    filteredLeaveTypes.forEach(leaveType => {
      const totalAllowed = leaveType.days;
      const relevantRequests = leaveRequests
        .filter(request => 
          request.leave_type?.toLowerCase() === leaveType.leave_type?.toLowerCase() && 
          (request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'pending')
        );
      
      const usedDays = relevantRequests.reduce((sum, request) => sum + (request.days || 0), 0);
      
      console.log(`${leaveType.leave_type}:`, {
        totalAllowed,
        relevantRequests,
        usedDays,
        remaining: Math.max(0, totalAllowed - usedDays)
      });
      
      remaining[leaveType.leave_type] = Math.max(0, totalAllowed - usedDays);
    });
    
    return remaining;
  }, [filteredLeaveTypes, leaveRequests]);

  // Calculate days between two dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  // Show loading state if either query is loading
  if (isLoading || isLoadingLeaveTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error || leaveTypesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Unable to Load Data</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {error?.message || leaveTypesError?.message || 'Failed to load leave requests. Please check your connection and try again.'}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                refetchLeaveRequests();
                refetchLeaveTypes();
              }}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Calculate days between dates
      const days = calculateDays(newRequest.startDate, newRequest.endDate);
      
      // Find the selected leave type
      const selectedLeaveType = leaveTypes.find(lt => lt.leave_type === newRequest.type);
      if (!selectedLeaveType) {
        alert('Please select a valid leave type');
        return;
      }
      
      // Check if requested days exceed the maximum allowed for this leave type
      if (days > selectedLeaveType.days) {
        alert(`You cannot request more than ${selectedLeaveType.days} days for ${selectedLeaveType.leave_type}`);
        return;
      }
      
      // Check if requested days exceed remaining available days
      const availableDays = remainingLeaveDays[newRequest.type] || 0;
      if (days > availableDays) {
        alert(`You only have ${availableDays} days remaining for ${newRequest.type}`);
        return;
      }
      
      // Prepare data - let backend determine employee details from authenticated user
      const requestData = {
        leave_type: newRequest.type,
        start_date: newRequest.startDate,
        end_date: newRequest.endDate,
        days: days,
        reason: newRequest.reason || ""
      };

      console.log('Sending request data:', requestData);

      if (editingRequest) {
        // Update existing request
        const result = await updateLeaveRequest({
          id: editingRequest,
          ...requestData
        }).unwrap();
        console.log('Update result:', result);
      } else {
        // Create new request
        const result = await createLeaveRequest(requestData).unwrap();
        console.log('Create result:', result);
      }
      
      // Reset form
      setShowNewRequestForm(false);
      setEditingRequest(null);
      setNewRequest({
        type: "",
        startDate: "",
        endDate: "",
        reason: ""
      });
    } catch (error) {
      console.error('Failed to save leave request:', error);
      console.error('Error data:', error.data);
      
      // Show specific error message from server
      const errorMessage = error.data?.message || error.data?.error || error.message || 'Unknown error occurred';
      
      alert('❌ Failed to save leave request:\n\n' + errorMessage);
    }
  };

  const handleCancelRequest = () => {
    setShowNewRequestForm(false);
    setEditingRequest(null);
    setNewRequest({
      type: "",
      startDate: "",
      endDate: "",
      reason: ""
    });
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request.id);
    setNewRequest({
      type: request.leave_type,
      startDate: request.start_date,
      endDate: request.end_date,
      reason: request.reason || ""
    });
    setShowNewRequestForm(true);
  };

  const handleDeleteRequest = async (requestId) => {
    console.log('Delete button clicked for request ID:', requestId);
    setDeleteRequestId(requestId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Attempting to delete request ID:', deleteRequestId);
      const result = await deleteLeaveRequest(deleteRequestId).unwrap();
      console.log('Delete successful:', result);
      setShowDeleteConfirm(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error('Failed to delete leave request:', error);
      console.error('Delete error details:', error.data);
      console.error('Error status:', error.status);
      
      if (error.status === 401) {
        console.error('Authentication error - user not logged in');
      } else if (error.status === 404) {
        console.error('Leave request not found or user not authorized');
      }
      
      // Keep the modal open so user can see what happened
      alert('Failed to delete leave request. Error: ' + (error.data?.message || error.message || 'Unknown error'));
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteRequestId(null);
  };

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Leave Requests</h1>
          <p className="text-gray-600 mt-1">Manage your leave applications and balance</p>
        </div>
        <button 
          onClick={() => setShowNewRequestForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Request</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading leave requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading leave requests
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error?.data?.message || 'Failed to load leave requests. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table - only show when not loading */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.employee?.employee_id || `EMP-${String(request.employee_id).padStart(3, '0')}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.leave_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.start_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.end_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleEditRequest(request)}
                            className="text-blue-600 hover:text-blue-700 mr-3 p-1 rounded hover:bg-blue-50"
                            title="Edit Request"
                          >
                            <img src="/icons/fi-sr-pencil.svg" alt="Edit" className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRequest(request.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Delete Request"
                          >
                            <img src="/icons/fi-sr-trash.svg" alt="Delete" className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compact Leave Balance Summary */}
      {!isLoading && leaveTypes.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Leave Balance</h3>
          <div className="flex flex-wrap gap-4">
            {leaveTypes.map((leaveType) => {
              const remaining = remainingLeaveDays[leaveType.leave_type] || 0;
              
              return (
                <div key={leaveType.id} className="flex items-center space-x-2 bg-white rounded px-3 py-2 border">
                  <span className="text-sm font-medium text-gray-900">{leaveType.leave_type}:</span>
                  <span className={`text-sm font-semibold ${
                    remaining > 5 ? 'text-green-600' : 
                    remaining > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {remaining} days left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Leave Request Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRequest ? 'Edit Leave Request' : 'New Leave Request'}
              </h3>
              <button
                onClick={handleCancelRequest}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  name="type"
                  value={newRequest.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select leave type...</option>
                  {filteredLeaveTypes.map((leaveType) => (
                    <option key={leaveType.id} value={leaveType.leave_type}>
                      {leaveType.leave_type} ({remainingLeaveDays[leaveType.leave_type] || 0} days remaining)
                    </option>
                  ))}
                </select>
                {/* Show information about filtered leave types */}
                {leaveTypes.length > filteredLeaveTypes.length && (
                  <p className="text-sm text-amber-600 mt-1 italic">
                    ℹ️ Note: {gender === 'male' ? 'Maternity leave is not available for male employees' : 'Paternity leave is not available for female employees'}
                  </p>
                )}
                {newRequest.type && remainingLeaveDays[newRequest.type] !== undefined && (
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum allowed: {filteredLeaveTypes.find(lt => lt.leave_type === newRequest.type)?.days || 0} days | 
                    Remaining: {remainingLeaveDays[newRequest.type]} days
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newRequest.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={newRequest.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              {newRequest.startDate && newRequest.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Duration:</span> {calculateDays(newRequest.startDate, newRequest.endDate)} day(s)
                  </p>
                </div>
              )}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={newRequest.reason}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div> */}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelRequest}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingRequest ? 'Update Request' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Leave Request
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this leave request? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
