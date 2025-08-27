import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function EmployeeSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/employee/dashboard",
      icon: "/icons/Dash2.svg"
    },
    {
      name: "My Profile",
      path: "/employee/profile",
      icon: "/icons/employee.svg"
    },
    {
      name: "Attendance",
      path: "/employee/attendance",
      icon: "/icons/attendance.svg"
    },
    {
      name: "Leave Requests",
      path: "/employee/leave-requests",
      icon: "/icons/leave.svg"
    },
    {
      name: "Payslips",
      path: "/employee/payslips",
      icon: "/icons/payroll.svg"
    },
    {
      name: "Notices",
      path: "/employee/notices",
      icon: "/icons/notice.svg"
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4">
        {/* Employee Info */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-red-200"
              src="/images/profile-photo.jpg"
              alt="Profile"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {JSON.parse(localStorage.getItem("employee") || "{}")?.name || "Rashedul Islam"}
              </h3>
              <p className="text-xs text-gray-600">
                ID: {JSON.parse(localStorage.getItem("employee") || "{}")?.id || "EMP-001"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-red-50 text-red-700 border-r-2 border-red-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <img 
                src={item.icon} 
                alt={item.name}
                className={`h-5 w-5 ${isActive(item.path) ? "filter-red" : ""}`}
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Present Days</span>
              <span className="font-semibold text-green-600">22</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Leave Balance</span>
              <span className="font-semibold text-blue-600">8</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Pending Requests</span>
              <span className="font-semibold text-yellow-600">1</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h4>
          <p className="text-xs text-blue-700 mb-3">
            Contact IT support for any technical issues
          </p>
          <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
