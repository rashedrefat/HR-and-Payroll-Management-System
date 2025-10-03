import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentEmployee } from "../../components/hooks/useCurrentEmployee";
import { useGetMyAttendancesQuery } from "../../features/api/attendanceApiSlice";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const currentEmployee = useCurrentEmployee();
  
  // Fetch employee attendance data
  const { data: attendanceData = [], isLoading: attendanceLoading } = useGetMyAttendancesQuery();
  
  // Helper function to format time from 24h to 12h format
  const formatTime = (timeString) => {
    if (!timeString) return '--';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  // Helper function to determine attendance status
  const getAttendanceStatus = (record) => {
    if (!record) return { status: 'No Record', color: 'text-gray-500' };
    
    if (!record.check_in_time) {
      return { status: 'Absent', color: 'text-red-600' };
    }
    
    return { status: 'Present', color: 'text-green-600' };
  };
  
  const employeeData = useMemo(() => {
    return {
      name: currentEmployee.fullName,
      employeeId: currentEmployee.empId,
      department: currentEmployee.department,
      designation: currentEmployee.designation,
      email: currentEmployee.email,
      phone: currentEmployee.phone,
      joinDate: currentEmployee.joinDate,
      profilePicture: currentEmployee.profilePicture,
    };
  }, [currentEmployee]);

  // Process attendance data for dashboard display
  const attendanceSummary = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) {
      return {
        todayRecord: null,
        yesterdayRecord: null,
        weeklyHours: 0,
        recentRecords: []
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get today's record
    const todayRecord = attendanceData.find(record => record.date === today);
    
    // Get yesterday's record
    const yesterdayRecord = attendanceData.find(record => record.date === yesterday);
    
    // Calculate weekly hours (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weeklyRecords = attendanceData.filter(record => record.date >= weekAgo);
    const weeklyHours = weeklyRecords.reduce((total, record) => {
      if (record.check_in_time && record.check_out_time) {
        const checkIn = new Date(`2000-01-01 ${record.check_in_time}`);
        const checkOut = new Date(`2000-01-01 ${record.check_out_time}`);
        const hours = (checkOut - checkIn) / (1000 * 60 * 60);
        return total + (hours > 0 ? hours : 0);
      }
      return total;
    }, 0);
    
    // Get most recent 3 records
    const sortedRecords = [...attendanceData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    return {
      todayRecord,
      yesterdayRecord,
      weeklyHours: Math.round(weeklyHours * 10) / 10, // Round to 1 decimal
      recentRecords: sortedRecords
    };
  }, [attendanceData]);

  // Handle loading state
  if (currentEmployee.isLoading) {
    return (
      <section className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Employee Dashboard</h1>
          <p className="text-gray-600 mt-1">Loading your information...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (currentEmployee.error) {
    return (
      <section className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Employee Dashboard</h1>
          <p className="text-red-600 mt-1">Unable to load employee information</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">
              {currentEmployee.error?.data?.error || 'Failed to load employee data. Please ensure you are logged in with an employee account.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Employee Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {employeeData.name}!</p>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            className="h-20 w-20 rounded-full object-cover border-4 border-red-200"
            src={employeeData.profilePicture}
            alt={employeeData.name}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employeeData.name}</h2>
            <p className="text-gray-600">{employeeData.designation}</p>
            <p className="text-sm text-gray-500">ID: {employeeData.employeeId}</p>
            <p className="text-sm text-gray-500">Department: {employeeData.department}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Attendance Widget */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            <button 
              onClick={() => navigate('/employee/attendance')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {/* Today's Attendance */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  attendanceSummary.todayRecord 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">Today</span>
              </div>
              <div className="text-sm text-gray-600">
                {attendanceLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : attendanceSummary.todayRecord ? (
                  <>
                    <span className="text-green-600 font-medium">
                      In: {formatTime(attendanceSummary.todayRecord.check_in_time)}
                    </span>
                    {attendanceSummary.todayRecord.check_out_time && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-600">
                          Out: {formatTime(attendanceSummary.todayRecord.check_out_time)}
                        </span>
                      </>
                    )}
                    {!attendanceSummary.todayRecord.check_out_time && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">In Progress</span>
                      </>
                    )}
                    <span className="mx-2">•</span>
                    <span className={getAttendanceStatus(attendanceSummary.todayRecord).color}>
                      {getAttendanceStatus(attendanceSummary.todayRecord).status}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No record</span>
                )}
              </div>
            </div>

            {/* Yesterday's Attendance */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  attendanceSummary.yesterdayRecord 
                    ? 'bg-blue-500' 
                    : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">Yesterday</span>
              </div>
              <div className="text-sm text-gray-600">
                {attendanceLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : attendanceSummary.yesterdayRecord ? (
                  <>
                    <span className="text-green-600">
                      In: {formatTime(attendanceSummary.yesterdayRecord.check_in_time)}
                    </span>
                    {attendanceSummary.yesterdayRecord.check_out_time && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-600">
                          Out: {formatTime(attendanceSummary.yesterdayRecord.check_out_time)}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">No record</span>
                )}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">This Week</span>
              </div>
              <div className="text-sm text-gray-600">
                {attendanceLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (
                  <>
                    <span className="font-medium">{attendanceSummary.weeklyHours}h</span>
                    <span className="mx-2">•</span>
                    <span className={`${
                      attendanceSummary.weeklyHours >= 35 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {attendanceSummary.weeklyHours >= 35 ? 'On Track' : 'Below Target'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Widget */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
            <button 
              onClick={() => navigate('/employee/leave-requests')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Request Leave
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Annual Leave</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">15 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Sick Leave</span>
              </div>
              <span className="text-sm font-semibold text-green-600">8 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Personal Leave</span>
              </div>
              <span className="text-sm font-semibold text-purple-600">3 days</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-yellow-700">1 leave request pending approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payslip & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Payslip Widget */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Latest Payslip</h3>
            <button 
              onClick={() => navigate('/employee/payslips')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Month</span>
              <span className="text-sm font-medium text-gray-900">September 2025</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gross Salary</span>
              <span className="text-sm font-semibold text-green-600">$5,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Deductions</span>
              <span className="text-sm font-medium text-red-600">-$850</span>
            </div>
            <hr className="my-3" />
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">Net Salary</span>
              <span className="text-lg font-bold text-green-600">$4,650</span>
            </div>
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700">Salary processed on Sept 30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders Widget */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications & Reminders</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Profile Update Required</p>
                <p className="text-xs text-gray-600 mt-1">Please update your emergency contact information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Training Reminder</p>
                <p className="text-xs text-gray-600 mt-1">Complete mandatory safety training by Oct 15</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Leave Approved</p>
                <p className="text-xs text-gray-600 mt-1">Your vacation request for Oct 5-7 has been approved</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                View all notifications
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/employee/attendance')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">Check In</span>
          </button>

          <button 
            onClick={() => navigate('/employee/leave-requests')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a1 1 0 011-1h2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">Request Leave</span>
          </button>

          <button 
            onClick={() => navigate('/employee/payslips')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">View Payslip</span>
          </button>

          <button 
            onClick={() => navigate('/employee/profile')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">Update Profile</span>
          </button>
        </div>
      </div>
    </section>
  );
}
