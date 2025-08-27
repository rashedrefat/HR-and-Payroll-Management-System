import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeNavbar() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("employee");
    navigate("/employee/login");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/employee/dashboard" className="flex items-center space-x-3">
              <img 
                src="/images/smarthrlogo.png" 
                alt="SmartHR" 
                className="h-8 w-auto"
              />
              <div className="text-xl font-bold text-gray-900">
                Employee Portal
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img 
                  src="/icons/search-icon.svg" 
                  alt="Search" 
                  className="h-4 w-4 text-gray-400"
                />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <img 
                src="/icons/Notification.svg" 
                alt="Notifications" 
                className="h-5 w-5"
              />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {employee.name || "Employee"}
                </div>
                <div className="text-xs text-gray-500">
                  {employee.designation || ""}
                </div>
              </div>
              <img
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                src="/images/profile-photo.jpg"
                alt={employee.name}
              />
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
