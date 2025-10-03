import React, { useState } from "react";
import Table from "../../components/table/Table";
import EmployeeAttendanceRow from "../../components/table/rows/EmployeeAttendanceRow";
import { 
  useGetMyAttendancesQuery,
  useCreateMyAttendanceMutation,
  useUpdateMyAttendanceMutation,
  useDeleteMyAttendanceMutation
} from "../../features/api/attendanceApiSlice";
import { useGetShiftsQuery } from "../../features/api/shiftApi";
import { formatTimeForDisplay, formatTimeForInput, convertTimeInputToAPI, isValid12HourFormat } from "../../utils/timeUtils";

const tableLabels = [
  { title: "Name", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Shift", sort: true },
  { title: "Check-In Time", sort: true },
  { title: "Check-Out Time", sort: true },
  { title: "Status", sort: true },
  { title: "Date", sort: true },
  { title: "Actions", sort: false },
];

export default function EmployeeAttendance() {
  // API hooks
  const { data: attendanceData = [], isLoading } = useGetMyAttendancesQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const [createAttendance] = useCreateMyAttendanceMutation();
  const [updateAttendance] = useUpdateMyAttendanceMutation();
  const [deleteAttendance] = useDeleteMyAttendanceMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [newAttendance, setNewAttendance] = useState({
    checkInTime: "",
    checkOutTime: "",
    date: "",
    shiftId: "",
  });

  // Transform API data for frontend compatibility
  const transformedData = attendanceData.map(record => ({
    id: record.id,
    name: record.name,
    employeeId: record.employee_id,
    shift: record.shift?.shift_name || "No Shift",
    checkInTime: formatTimeForDisplay(record.check_in_time) || "--",
    checkOutTime: formatTimeForDisplay(record.check_out_time) || "--",
    status: {
      isLate: record.is_late || false,
      isEarlyOut: record.is_early_out || false,
      lateMinutes: record.late_minutes || 0,
      earlyOutMinutes: record.early_out_minutes || 0,
    },
    date: record.date ? record.date.split('T')[0] : '--',
    // Keep original API fields for editing
    check_in_time: record.check_in_time,
    check_out_time: record.check_out_time,
    shift_id: record.shift_id,
  }));

  // Filter data based on search
  const filteredData = transformedData.filter((record) => {
    const matchesSearch = record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: transformedData.length,
    present: transformedData.filter(record => record.checkInTime !== "--" && record.checkOutTime !== "--").length,
    absent: transformedData.filter(record => record.checkInTime === "--" && record.checkOutTime === "--").length,
    late: transformedData.filter(record => record.status?.isLate).length,
    earlyOut: transformedData.filter(record => record.status?.isEarlyOut).length,
  };

  // Handler functions for edit and delete actions
  const handleAttendanceEdit = (attendanceRecord) => {
    setEditingAttendance(attendanceRecord);
    
    // Format date properly for the input field
    const formatDate = (dateString) => {
      if (!dateString) return "";
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      // If it's in ISO format, extract the date part
      return dateString.split('T')[0];
    };
    
    setNewAttendance({
      checkInTime: formatTimeForInput(attendanceRecord.check_in_time) || "",
      checkOutTime: formatTimeForInput(attendanceRecord.check_out_time) || "",
      date: formatDate(attendanceRecord.date),
      shiftId: attendanceRecord.shift_id || "",
    });
    setShowAddModal(true);
  };

  const handleAttendanceDelete = async (attendanceRecord) => {
    try {
      await deleteAttendance(attendanceRecord.id).unwrap();
      // The RTK Query will automatically refetch the data and update the UI
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      alert('Failed to delete attendance record');
    }
  };

  // Modal functions
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAttendance(null);
    setNewAttendance({
      checkInTime: "",
      checkOutTime: "",
      date: "",
      shiftId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    
    try {
      // Validate time formats
      if (newAttendance.checkInTime && !isValid12HourFormat(newAttendance.checkInTime)) {
        alert('Please enter check-in time in 12-hour format (e.g., 9:00 AM)');
        return;
      }
      
      if (newAttendance.checkOutTime && !isValid12HourFormat(newAttendance.checkOutTime)) {
        alert('Please enter check-out time in 12-hour format (e.g., 5:00 PM)');
        return;
      }

      const attendanceData = {
        shift_id: newAttendance.shiftId || null,
        check_in_time: newAttendance.checkInTime || null,
        check_out_time: newAttendance.checkOutTime || null,
        date: newAttendance.date,
      };

      console.log('Sending attendance data:', attendanceData);

      if (editingAttendance) {
        // Update attendance
        await updateAttendance({ 
          id: editingAttendance.id, 
          ...attendanceData 
        }).unwrap();
      } else {
        // Add new attendance
        await createAttendance(attendanceData).unwrap();
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      
      // Show detailed error information
      let errorMessage = 'Failed to save attendance record';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors) {
        const validationErrors = Object.values(error.data.errors).flat();
        errorMessage = 'Validation errors: ' + validationErrors.join(', ');
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">My Attendance</h1>
          <p className="text-gray-600 mt-1">View your daily attendance records and working hours</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search attendance..."
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
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <img src="/icons/plus-Icon.svg" alt="Add" className="h-4 w-4" />
            <span>Add Attendance</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg shadow p-4 border-l-4 border-yellow-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg shadow p-4 border-l-4 border-orange-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Early Out</p>
              <p className="text-2xl font-bold text-gray-900">{stats.earlyOut}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {stats.total} records
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading attendance data...</div>
            </div>
          ) : (
            <Table
              tableLabels={tableLabels}
              dataSet={filteredData.length}
              itemsPerPage={10}
            >
              {filteredData.map((data, index) => (
                <EmployeeAttendanceRow
                  key={data.id}
                  data={data}
                  index={index}
                  onEdit={handleAttendanceEdit}
                  onDelete={handleAttendanceDelete}
                />
              ))}
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Attendance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAttendance ? "Edit Attendance" : "Add New Attendance"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitAttendance} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newAttendance.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift
                  </label>
                  <select
                    name="shiftId"
                    value={newAttendance.shiftId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Shift (Optional)</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.shift_name} ({shift.check_in} - {shift.check_out})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecting a shift will automatically detect late arrivals and early departures
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-In Time *
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formatTimeForInput(newAttendance.checkInTime)}
                    onChange={(e) => setNewAttendance({...newAttendance, checkInTime: convertTimeInputToAPI(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Select time using the picker - will be saved as 12-hour format</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-Out Time
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formatTimeForInput(newAttendance.checkOutTime)}
                    onChange={(e) => setNewAttendance({...newAttendance, checkOutTime: convertTimeInputToAPI(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select time using the picker - will be saved as 12-hour format</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                >
                  {editingAttendance ? "Update Attendance" : "Add Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
