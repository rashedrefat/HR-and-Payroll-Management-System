import React from "react";
import { Link, useLocation } from "react-router-dom";
import PortalPageButton from "../sidebar/PortalPageButton";
import { useCurrentEmployee } from "../hooks/useCurrentEmployee";

export default function EmployeeSidebar() {
  const location = useLocation();
  const currentEmployee = useCurrentEmployee();

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
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4">
        {/* Portal Switcher Button */}
        <div className="mb-4">
          <PortalPageButton />
        </div>
        
        {/* Employee Info */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-red-200"
              src={currentEmployee.profilePicture}
              alt={currentEmployee.fullName}
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {currentEmployee.fullName}
              </h3>
              <p className="text-xs text-gray-600">
                ID: {currentEmployee.employeeId}
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


      </div>
    </aside>
  );
}
