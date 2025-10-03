import React from 'react';

// Removed duplicate LeaveApplication component and default export
import Table from "../components/table/Table";
import { useState, useMemo, useCallback } from "react";
import AllEmployeeRow from "../components/table/rows/LeaveApplicationRow";
import { 
  useGetLeaveRequestsQuery,
  useUpdateLeaveRequestStatusMutation,
  useAdminDeleteLeaveRequestMutation
} from "../features/leave/leaveRequestApiSlice";
import {
  useGetLeaveTypesQuery,
} from "../features/api/leaveTypeApi";
import {
  useGetEmployeesQuery,
} from "../features/api/employeeApiSlice";

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
  
  const { data: leaveTypes = [] } = useGetLeaveTypesQuery();
  const { data: employees = [], isLoading: employeesLoading } = useGetEmployeesQuery();
  
  const [updateLeaveRequestStatus] = useUpdateLeaveRequestStatusMutation();
  const [deleteLeaveRequest] = useAdminDeleteLeaveRequestMutation();
  
  // State for tabs
  const [activeTab, setActiveTab] = useState("requests");
  
  const [select, setSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); // Add sort state
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  
  // Additional state for leave balance view
  const [balanceSearchTerm, setBalanceSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");

  // Helper function to determine employee gender based on name
  const getEmployeeGender = useCallback((employeeName) => {
    const name = employeeName.toLowerCase();
    const femaleEmployees = ['sadia', 'lina'];
    const maleEmployees = ['rafiad', 'auntu', 'bandhan', 'rashed', 'shahariar'];
    
    for (const femaleName of femaleEmployees) {
      if (name.includes(femaleName)) return 'female';
    }
    
    for (const maleName of maleEmployees) {
      if (name.includes(maleName)) return 'male';
    }
    
    return 'unknown'; // Default for employees not in the specified lists
  }, []);

  // Helper function to check if an employee is eligible for a leave type
  const isEligibleForLeaveType = useCallback((employeeName, leaveType) => {
    const gender = getEmployeeGender(employeeName);
    const leaveTypeLower = leaveType.toLowerCase();
    
    // Maternity leave only for female employees
    if (leaveTypeLower.includes('maternity')) {
      return gender === 'female';
    }
    
    // Paternity leave only for male employees
    if (leaveTypeLower.includes('paternity')) {
      return gender === 'male';
    }
    
    // All other leave types are available to everyone
    return true;
  }, [getEmployeeGender]);

  // Calculate comprehensive leave balances for all employees
  const employeeLeaveBalances = useMemo(() => {
    if (!employees.length || !leaveTypes.length || !leaveRequestsData.length) return [];
    
    return employees.map(employee => {
      const employeeRequests = leaveRequestsData.filter(request => 
        request.employee_id === employee.id
      );
      
      // Filter leave types based on employee gender eligibility
      const eligibleLeaveTypes = leaveTypes.filter(leaveType => 
        isEligibleForLeaveType(employee.name, leaveType.leave_type)
      );
      
      const leaveBalances = eligibleLeaveTypes.map(leaveType => {
        const relevantRequests = employeeRequests.filter(request => 
          request.leave_type?.toLowerCase() === leaveType.leave_type?.toLowerCase() && 
          (request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'pending')
        );
        
        const usedDays = relevantRequests.reduce((sum, request) => sum + (request.days || 0), 0);
        const remainingDays = Math.max(0, leaveType.days - usedDays);
        
        return {
          leaveType: leaveType.leave_type,
          totalAllowed: leaveType.days,
          usedDays,
          remainingDays,
          requests: relevantRequests,
          isEligible: true // Since we already filtered, all remaining are eligible
        };
      });
      
      // Also include ineligible leave types with zero values for display context
      const ineligibleLeaveTypes = leaveTypes.filter(leaveType => 
        !isEligibleForLeaveType(employee.name, leaveType.leave_type)
      ).map(leaveType => ({
        leaveType: leaveType.leave_type,
        totalAllowed: leaveType.days,
        usedDays: 0,
        remainingDays: 0,
        requests: [],
        isEligible: false
      }));
      
      const allLeaveBalances = [...leaveBalances, ...ineligibleLeaveTypes];
      
      return {
        employee,
        leaveBalances: allLeaveBalances,
        eligibleLeaveBalances: leaveBalances, // Only eligible leave types
        gender: getEmployeeGender(employee.name),
        totalUsedDays: leaveBalances.reduce((sum, balance) => sum + balance.usedDays, 0),
        totalRemainingDays: leaveBalances.reduce((sum, balance) => sum + balance.remainingDays, 0)
      };
    });
  }, [employees, leaveTypes, leaveRequestsData, isEligibleForLeaveType, getEmployeeGender]);

  // Filter employee leave balances based on search and filter criteria
  const filteredEmployeeBalances = useMemo(() => {
    return employeeLeaveBalances.filter(item => {
      const employee = item.employee;
      const searchLower = balanceSearchTerm.toLowerCase();
      
      // Search filter
      const matchesSearch = !balanceSearchTerm || (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.employee_id.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower)
      );
      
      // Department filter
      const matchesDepartment = departmentFilter === "All" || 
        employee.department?.name === departmentFilter;
      
      // Leave type filter - check if employee has used this leave type and is eligible for it
      const matchesLeaveType = leaveTypeFilter === "All" || 
        item.leaveBalances.some(balance => 
          balance.leaveType === leaveTypeFilter && 
          balance.isEligible && 
          balance.usedDays > 0
        );
      
      return matchesSearch && matchesDepartment && matchesLeaveType;
    });
  }, [employeeLeaveBalances, balanceSearchTerm, departmentFilter, leaveTypeFilter]);

  // Get unique departments for filter dropdown
  const uniqueDepartments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department?.name).filter(Boolean))];
  }, [employees]);

  // Transform API data to match table format and apply sorting
  const tableData = useMemo(() => {
    const transformedData = leaveRequestsData.map(request => ({
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
      createdAt: new Date(request.created_at || request.updated_at || request.start_date), // Use created_at for sorting, fallback to updated_at or start_date
      originalRequest: request // Keep original request for sorting purposes
    }));

    // Apply sorting
    return transformedData.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime(); // Newest first
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime(); // Oldest first
      }
    });
  }, [leaveRequestsData, sortOrder]);

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
    console.log('Delete button clicked for ID:', id);
    setDeleteRequestId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    console.log('Confirming delete for ID:', deleteRequestId);
    console.log('Using admin delete endpoint');
    try {
      const result = await deleteLeaveRequest(deleteRequestId).unwrap();
      console.log('Delete successful:', result);
      setShowDeleteModal(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error('Failed to delete leave request:', error);
      console.error('Error details:', error.data);
      alert('Failed to delete leave request: ' + (error.data?.message || error.message || 'Unknown error'));
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
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
  if (isLoading || employeesLoading) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            Loading {isLoading ? "leave requests" : "employee data"}...
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage employee leave requests and track leave balances</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === "requests" ? "Search employees..." : "Search employees..."}
            value={activeTab === "requests" ? searchTerm : balanceSearchTerm}
            onChange={(e) => activeTab === "requests" ? setSearchTerm(e.target.value) : setBalanceSearchTerm(e.target.value)}
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "requests"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab("balances")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "balances"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Employee Leave Balances
            </button>
          </nav>
        </div>
      </div>

      {/* Leave Requests Tab */}
      {activeTab === "requests" && (
        <>
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

      {/* Status Filter and Sort Options */}
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
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by Date:</label>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="newest">↓ Newest First</option>
                <option value="oldest">↑ Oldest First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
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

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {tableData.length} leave requests
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={sortOrder === "newest" ? "M19 14l-7 7m0 0l-7-7m7 7V3" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
          </svg>
          <span>Sorted by {sortOrder === "newest" ? "newest first" : "oldest first"}</span>
        </div>
      </div>

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
            <div className="flex justify-between gap-3 mt-6">
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-red-300 rounded-md hover:bg-red-50"
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
        </>
      )}

      {/* Employee Leave Balances Tab */}
      {activeTab === "balances" && (
        <>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Department:</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="All">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Leave Type:</label>
                <select
                  value={leaveTypeFilter}
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="All">All Leave Types</option>
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.leave_type}>{type.leave_type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Gender-based leave policy note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Leave Policy Information:</p>
                  <p>• <strong>Maternity Leave:</strong> Available only for female employees (Sadia, Lina)</p>
                  <p>• <strong>Paternity Leave:</strong> Available only for male employees (Rafiad, Auntu, Bandhan, Rashed, Shahariar)</p>
                  <p>• <strong>Other Leave Types:</strong> Available for all employees regardless of gender</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Leave Balances Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployeeBalances.map((item) => (
              <div key={item.employee.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                {/* Employee Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.employee.image || "/images/profile-photo.jpg"}
                        alt={item.employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.employee.name}</h3>
                        <p className="text-sm text-gray-600">{item.employee.employee_id}</p>
                        <p className="text-xs text-gray-500">{item.employee.department?.name || "N/A"}</p>
                      </div>
                    </div>
                    {/* Gender indicator */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.gender === 'female' 
                          ? 'bg-pink-100 text-pink-800' 
                          : item.gender === 'male' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.gender === 'female' ? '♀ Female' : item.gender === 'male' ? '♂ Male' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Leave Balance Summary */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{item.totalUsedDays}</p>
                      <p className="text-xs text-gray-600">Days Used</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{item.totalRemainingDays}</p>
                      <p className="text-xs text-gray-600">Days Remaining</p>
                    </div>
                  </div>

                  {/* Leave Type Details */}
                  <div className="space-y-3">
                    {item.leaveBalances.map((balance) => (
                      <div 
                        key={balance.leaveType} 
                        className={`border rounded-lg p-3 ${
                          balance.isEligible 
                            ? 'border-gray-200 bg-white' 
                            : 'border-gray-300 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium text-sm ${
                              balance.isEligible ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {balance.leaveType}
                            </h4>
                            {!balance.isEligible && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                                Not Eligible
                              </span>
                            )}
                          </div>
                          <span className={`text-xs ${
                            balance.isEligible ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {balance.isEligible ? `${balance.usedDays}/${balance.totalAllowed} days` : `0/${balance.totalAllowed} days`}
                          </span>
                        </div>
                        
                        {balance.isEligible ? (
                          <>
                            {/* Progress Bar for eligible leave types */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{
                                  width: `${balance.totalAllowed > 0 ? (balance.usedDays / balance.totalAllowed) * 100 : 0}%`
                                }}
                              ></div>
                            </div>
                            
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Used: {balance.usedDays}</span>
                              <span>Remaining: {balance.remainingDays}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Disabled state for ineligible leave types */}
                            <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                              <div className="bg-gray-400 h-2 rounded-full w-0"></div>
                            </div>
                            
                            <div className="text-xs text-gray-400 text-center">
                              {balance.leaveType.toLowerCase().includes('maternity') 
                                ? 'Available only for female employees' 
                                : balance.leaveType.toLowerCase().includes('paternity')
                                ? 'Available only for male employees'
                                : 'Not available for this employee'}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show message if no employees match filters */}
          {filteredEmployeeBalances.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No employees found matching the current filters.</div>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// Removed duplicate default export