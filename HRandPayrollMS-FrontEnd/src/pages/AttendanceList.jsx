import { useState } from "react";
import Table from "../components/table/Table";
import AttendanceListRow from "../components/table/rows/AttendanceListRow";
import IconButton from "../components/buttons/IconButton";
import { 
  useGetAttendancesQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation
} from "../features/api/attendanceApiSlice";
import { useGetShiftsQuery } from "../features/api/shiftApi";
import { formatTimeForDisplay, formatTimeForInput, isValid12HourFormat, convertTimeInputToAPI } from "../utils/timeUtils";

// Helper functions for automatic time selection
const getCurrentTime12Hour = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const getCommonTimes = () => [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
];

const tableLabels = [
  { title: "Name", sort: true, field: "name" },
  { title: "Employee ID", sort: true, field: "employeeId" },
  { title: "Shift", sort: true, field: "shift" },
  { title: "Check In Time", sort: true, field: "checkInTime" },
  { title: "Check Out Time", sort: true, field: "checkOutTime" },
  { title: "Status", sort: true, field: "status" },
  { title: "Date", sort: true, field: "date" },
  { title: "Action", sort: false },
];

export default function AttendanceList() {
  // API hooks
  const { data: rawAttendanceData = [], isLoading } = useGetAttendancesQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const [createAttendance] = useCreateAttendanceMutation();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const [select, setSelect] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [deleteAttendanceId, setDeleteAttendanceId] = useState(null);
  
  // Sorting state
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first
  // Initial state constant for consistency
  const initialAttendanceState = {
    employeeName: '',
    employeeId: '',
    shiftId: '',
    checkInTime: '',
    checkOutTime: '',
    date: ''
  };
  
  const [newAttendance, setNewAttendance] = useState(initialAttendanceState);

  // Transform API data to match the frontend structure
  const attendanceData = rawAttendanceData.map(attendance => ({
    id: attendance.id,
    name: {
      title: attendance.name,
      image: attendance.employee?.image || "/images/profile-photo.jpg",
      visibleCheckbox: true,
      id: attendance.id,
    },
    employeeId: attendance.employee_id,
    shift: attendance.shift?.shift_name || "No Shift",
    shift_id: attendance.shift_id, // Add shift_id for editing
    checkInTime: formatTimeForDisplay(attendance.check_in_time) || "--",
    checkOutTime: formatTimeForDisplay(attendance.check_out_time) || "--",
    status: {
      isLate: attendance.is_late || false,
      isEarlyOut: attendance.is_early_out || false,
      lateMinutes: attendance.late_minutes || 0,
      earlyOutMinutes: attendance.early_out_minutes || 0,
    },
    date: attendance.date ? attendance.date.split('T')[0] : '--',
  }));

  // Filter table data based on search term and date range
  const filteredData = attendanceData.filter((attendance) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Text search filter
    const matchesSearch = !searchTerm || (
      attendance.name.title.toLowerCase().includes(searchLower) ||
      attendance.employeeId.toLowerCase().includes(searchLower)
    );

    // Date range filter
    const attendanceDate = new Date(attendance.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const matchesDateRange = (!fromDate || attendanceDate >= fromDate) &&
                            (!toDate || attendanceDate <= toDate);

    // Single date search (if someone selects the same date in both from and to)
    const matchesSpecificDate = (dateFrom && dateTo && dateFrom === dateTo) ? 
      attendance.date === dateFrom : true;

    return matchesSearch && matchesDateRange && matchesSpecificDate;
  });

  // Sorting function
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "name":
        aValue = a.name.title.toLowerCase();
        bValue = b.name.title.toLowerCase();
        break;
      case "employeeId":
        aValue = a.employeeId;
        bValue = b.employeeId;
        break;
      case "shift":
        aValue = a.shift.toLowerCase();
        bValue = b.shift.toLowerCase();
        break;
      case "checkInTime":
        // Convert time to sortable format (handle "--" cases)
        aValue = a.checkInTime === "--" ? "99:99" : a.checkInTime;
        bValue = b.checkInTime === "--" ? "99:99" : b.checkInTime;
        break;
      case "checkOutTime":
        aValue = a.checkOutTime === "--" ? "99:99" : a.checkOutTime;
        bValue = b.checkOutTime === "--" ? "99:99" : b.checkOutTime;
        break;
      case "status":
        // Sort by late status first, then early out
        aValue = a.status.isLate ? 2 : (a.status.isEarlyOut ? 1 : 0);
        bValue = b.status.isLate ? 2 : (b.status.isEarlyOut ? 1 : 0);
        break;
      case "date":
      default:
        aValue = new Date(a.date || "1900-01-01");
        bValue = new Date(b.date || "1900-01-01");
        break;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const resetSelection = () => setSelect([]);

  const handleSelect = (item, e) => {
    if (e.target.checked) {
      setSelect([...select, item]);
    } else {
      setSelect(select.filter((data) => item !== data));
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelect(sortedData.map((data) => data.id));
    } else {
      resetSelection();
    }
  };

  const handleSearch = () => {
    // The filtering is already applied automatically through the sortedData
    // This function can be used for additional search actions if needed
    console.log("Searching with date range:", dateFrom, "to", dateTo);
    console.log("Search term:", searchTerm);
    console.log("Filtered and sorted results:", sortedData.length, "records found");
  };

  // Modal functions
  const handleAddAttendance = () => {
    // Reset form state for new attendance
    setNewAttendance({ ...initialAttendanceState });
    setEditingAttendance(null); // Clear any editing state
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingAttendance(null);
    setNewAttendance({ ...initialAttendanceState });
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
        name: newAttendance.employeeName,
        employee_id: newAttendance.employeeId,
        shift_id: newAttendance.shiftId || null,
        check_in_time: newAttendance.checkInTime || null,
        check_out_time: newAttendance.checkOutTime || null,
        date: newAttendance.date,
      };

      await createAttendance(attendanceData).unwrap();
      
      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error('Failed to create attendance:', error);
      alert('Failed to create attendance record');
    }
  };

  // Handler functions for edit and delete actions
  const handleAttendanceEdit = (attendanceData) => {
    setEditingAttendance(attendanceData);
    

    
    // Format date to YYYY-MM-DD format for HTML date input
    const formatDate = (date) => {
      if (!date) return '';
      // If date is already in YYYY-MM-DD format, return as is
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // If date includes time, extract just the date part
      if (typeof date === 'string' && date.includes('T')) {
        return date.split('T')[0];
      }
      // If date is in DD/MM/YYYY or MM/DD/YYYY format, convert
      if (typeof date === 'string' && date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
          // Assume DD/MM/YYYY format (adjust if needed)
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      // Try to parse as Date object
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0];
        }
      } catch {
        console.warn('Could not parse date:', date);
      }
      return date;
    };
    
    setNewAttendance({
      employeeName: attendanceData.name.title,
      employeeId: attendanceData.employeeId,
      shiftId: attendanceData.shift_id || '',
      checkInTime: formatTimeForInput(attendanceData.checkInTime),
      checkOutTime: formatTimeForInput(attendanceData.checkOutTime),
      date: formatDate(attendanceData.date)
    });
    setShowEditModal(true);
  };

  const handleAttendanceDelete = (attendanceData) => {
    setDeleteAttendanceId(attendanceData.id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAttendance(deleteAttendanceId).unwrap();
      setShowDeleteModal(false);
      setDeleteAttendanceId(null);
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      alert('Failed to delete attendance record');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteAttendanceId(null);
  };

  const handleEditSubmit = async (e) => {
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
        name: newAttendance.employeeName,
        employee_id: newAttendance.employeeId,
        shift_id: newAttendance.shiftId || null,
        check_in_time: newAttendance.checkInTime || null,
        check_out_time: newAttendance.checkOutTime || null,
        date: newAttendance.date,
      };

      console.log('Sending attendance data:', attendanceData);
      console.log('Update ID:', editingAttendance.id);

      await updateAttendance({ 
        id: editingAttendance.id, 
        ...attendanceData 
      }).unwrap();
      
      setShowEditModal(false);
      setEditingAttendance(null);
      setNewAttendance({ ...initialAttendanceState });
    } catch (error) {
      console.error('Failed to update attendance:', error);
      
      // Show detailed error information
      let errorMessage = 'Failed to update attendance record';
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

  const handleExportToExcel = () => {
    // Handle Excel export functionality here
    console.log("Exporting to Excel...");
  };

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Attendance List</h1>
          <p className="text-gray-600 mt-1">Track and monitor employee attendance records</p>
        </div>
        <button onClick={handleAddAttendance}>
          <IconButton
            text="Add Attendance"
            color="text-white"
            bg="bg-red-600"
            icon="/icons/plus-Icon.svg"
            className="hover:bg-red-700"
          />
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, employee ID, reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
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
          <div>
            <IconButton
              text="Search"
              color="text-white"
              bg="bg-red-600"
              icon="/icons/search2-icon.svg"
              onClick={handleSearch}
              className="hover:bg-red-700"
            />
          </div>
        </div>
      </div>

      {/* Sorting Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="employeeId">Employee ID</option>
              <option value="shift">Shift</option>
              <option value="checkInTime">Check In Time</option>
              <option value="checkOutTime">Check Out Time</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Order:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSortOrder("asc")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  sortOrder === "asc" 
                    ? "bg-white text-red-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ↑ Ascending
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  sortOrder === "desc" 
                    ? "bg-white text-red-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ↓ Descending
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              Showing {sortedData.length} records
            </span>
            {(sortBy !== "date" || sortOrder !== "desc" || searchTerm || dateFrom || dateTo) ? (
              <div className="flex gap-2">
                {(sortBy !== "date" || sortOrder !== "desc") && (
                  <button
                    onClick={() => {
                      setSortBy("date");
                      setSortOrder("desc");
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                    title="Reset to default sort (Latest first)"
                  >
                    Reset Sort
                  </button>
                )}
                {(searchTerm || dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    title="Clear all filters"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Quick Sort Buttons */}
        {/* <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Quick sorts:</span>
          {[
            { label: "Latest First", field: "date", order: "desc" },
            { label: "Oldest First", field: "date", order: "asc" },
            { label: "Name A-Z", field: "name", order: "asc" },
            { label: "Name Z-A", field: "name", order: "desc" },
            { label: "Early Check-in", field: "checkInTime", order: "asc" },
            { label: "Late Check-in", field: "checkInTime", order: "desc" },
          ].map((quickSort) => (
            <button
              key={`${quickSort.field}-${quickSort.order}`}
              onClick={() => {
                setSortBy(quickSort.field);
                setSortOrder(quickSort.order);
              }}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                sortBy === quickSort.field && sortOrder === quickSort.order
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {quickSort.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <IconButton
          text="Export to Excel"
          color="text-white"
          bg="bg-green-600"
          icon="/icons/export.svg"
          onClick={handleExportToExcel}
          className="hover:bg-green-700"
        />
      </div>

      {/* Current Sort Status */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span>
            Currently sorted by <strong>{tableLabels.find(label => label.field === sortBy)?.title || sortBy}</strong> in{" "}
            <strong>{sortOrder === "asc" ? "ascending" : "descending"}</strong> order
          </span>
          <span className="ml-auto text-blue-600">
            {sortedData.length} {sortedData.length === 1 ? 'record' : 'records'} found
          </span>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading attendance records...</div>
          </div>
        ) : (
          <Table
            selectAll={selectAll}
            selectRow={handleSelect}
            selectedData={select}
            dataSet={sortedData.length}
            tableLabels={tableLabels}
            itemsPerPage={10}
            resetSelection={resetSelection}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          >
            {sortedData.map((data) => (
              <AttendanceListRow
                key={data.id}
                data={data}
                selectedData={select}
                selectRow={handleSelect}
                onEdit={handleAttendanceEdit}
                onDelete={handleAttendanceDelete}
              />
            ))}
          </Table>
        )}
      </div>

      {/* Add Attendance Modal */}
      {showAddModal && !editingAttendance && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Attendance</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitAttendance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employee Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Name *
                    </label>
                    <input
                      type="text"
                      name="employeeName"
                      value={newAttendance.employeeName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter employee name"
                    />
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={newAttendance.employeeId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., EMP-12345"
                    />
                  </div>

                  {/* Shift Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shift
                    </label>
                    <select
                      name="shiftId"
                      value={newAttendance.shiftId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

                  {/* Check In Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check In Time *
                    </label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={formatTimeForInput(newAttendance.checkInTime)}
                      onChange={(e) => setNewAttendance({...newAttendance, checkInTime: convertTimeInputToAPI(e.target.value)})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setNewAttendance({...newAttendance, checkInTime: getCurrentTime12Hour()})}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Now
                      </button>
                      <select
                        onChange={(e) => e.target.value && setNewAttendance({...newAttendance, checkInTime: e.target.value})}
                        className="text-xs px-2 py-1 border rounded"
                        value=""
                      >
                        <option value="">Quick Select</option>
                        {getCommonTimes().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Will be displayed as 12-hour format (AM/PM)</p>
                  </div>

                  {/* Check Out Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Out Time *
                    </label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={formatTimeForInput(newAttendance.checkOutTime)}
                      onChange={(e) => setNewAttendance({...newAttendance, checkOutTime: convertTimeInputToAPI(e.target.value)})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setNewAttendance({...newAttendance, checkOutTime: getCurrentTime12Hour()})}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Now
                      </button>
                      <select
                        onChange={(e) => e.target.value && setNewAttendance({...newAttendance, checkOutTime: e.target.value})}
                        className="text-xs px-2 py-1 border rounded"
                        value=""
                      >
                        <option value="">Quick Select</option>
                        {getCommonTimes().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Will be displayed as 12-hour format (AM/PM)</p>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newAttendance.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Add Attendance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditModal && editingAttendance && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Attendance</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Name *
                    </label>
                    <input
                      type="text"
                      value={newAttendance.employeeName}
                      onChange={(e) => setNewAttendance({...newAttendance, employeeName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      value={newAttendance.employeeId}
                      onChange={(e) => setNewAttendance({...newAttendance, employeeId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shift
                    </label>
                    <select
                      value={newAttendance.shiftId}
                      onChange={(e) => setNewAttendance({...newAttendance, shiftId: e.target.value})}
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
                      Check In Time *
                    </label>
                    <input
                      type="time"
                      value={formatTimeForInput(newAttendance.checkInTime)}
                      onChange={(e) => setNewAttendance({...newAttendance, checkInTime: convertTimeInputToAPI(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setNewAttendance({...newAttendance, checkInTime: getCurrentTime12Hour()})}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Now
                      </button>
                      <select
                        onChange={(e) => e.target.value && setNewAttendance({...newAttendance, checkInTime: e.target.value})}
                        className="text-xs px-2 py-1 border rounded"
                        value=""
                      >
                        <option value="">Quick Select</option>
                        {getCommonTimes().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select time using the picker - will be saved as 12-hour format</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check Out Time
                    </label>
                    <input
                      type="time"
                      value={formatTimeForInput(newAttendance.checkOutTime)}
                      onChange={(e) => setNewAttendance({...newAttendance, checkOutTime: convertTimeInputToAPI(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setNewAttendance({...newAttendance, checkOutTime: getCurrentTime12Hour()})}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Now
                      </button>
                      <select
                        onChange={(e) => e.target.value && setNewAttendance({...newAttendance, checkOutTime: e.target.value})}
                        className="text-xs px-2 py-1 border rounded"
                        value=""
                      >
                        <option value="">Quick Select</option>
                        {getCommonTimes().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select time using the picker - will be saved as 12-hour format</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newAttendance.date}
                      onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>


                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Update Attendance
                  </button>
                </div>
              </form>
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
                <h3 className="text-lg font-medium text-gray-900">Delete Attendance Record</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this attendance record? This action cannot be undone and will permanently remove the attendance data.
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
    </section>
  );
}
