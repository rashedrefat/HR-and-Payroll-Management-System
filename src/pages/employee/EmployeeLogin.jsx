import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication logic (in a real app, this would be an API call)
    if (formData.employeeId === "EMP-001" && formData.password === "password") {
      localStorage.setItem("employee", JSON.stringify({
        id: "EMP-001",
        name: "Rashedul Islam",
        department: "Web Development",
        designation: "Senior Web Developer"
      }));
      navigate("/employee/dashboard");
    } else {
      setError("Invalid employee ID or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img 
            src="/images/smarthrlogo.png" 
            alt="SmartHR Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Enter your employee ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">
              Contact IT Support
            </a>
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Employee ID: EMP-001<br />
            Password: password
          </p>
        </div>
      </div>
    </div>
  );
}
