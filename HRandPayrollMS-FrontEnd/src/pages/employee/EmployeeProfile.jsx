import React, { useState } from "react";
import { useCurrentEmployee } from "../../components/hooks/useCurrentEmployee";

export default function EmployeeProfile() {
  const currentEmployee = useCurrentEmployee();
  
  const [employeeData, setEmployeeData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joinDate: "",
    status: "",
  });

  // Update local state when currentEmployee data is loaded
  React.useEffect(() => {
    if (currentEmployee && !currentEmployee.isLoading && !currentEmployee.error) {
      setEmployeeData({
        name: currentEmployee.fullName || "",
        employeeId: currentEmployee.empId || "",
        email: currentEmployee.email || "",
        phone: currentEmployee.phone || "",
        department: currentEmployee.department || "",
        designation: currentEmployee.designation || "",
        joinDate: currentEmployee.joinDate || "",
        address: currentEmployee.address || "",
        emergencyContact: currentEmployee.emergencyContact || "",
        bloodGroup: currentEmployee.bloodGroup || "",
        dateOfBirth: currentEmployee.dateOfBirth || "",
        status: currentEmployee.isActive ? "Active" : "Inactive",
      });
    }
  }, [currentEmployee]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
    // In a real app, you would make an API call here
    console.log("Profile updated:", employeeData);
  };

  // Handle loading state
  if (currentEmployee.isLoading) {
    return (
      <section className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">My Profile</h1>
          <p className="text-gray-600 mt-1">Loading your profile information...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse text-center">
                <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">My Profile</h1>
          <p className="text-red-600 mt-1">Unable to load profile information</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">
              {currentEmployee.error?.data?.error || 'Failed to load profile data. Please ensure you are logged in with an employee account.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <img src="/icons/pencil.svg" alt="Edit" className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <img
                className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-red-200"
                src={currentEmployee.profilePicture || "/images/profile-photo.jpg"}
                alt={employeeData.name}
              />
              <h2 className="text-xl font-bold text-gray-900 mt-4">{employeeData.name}</h2>
              <p className="text-gray-600">{employeeData.designation}</p>
              <p className="text-sm text-gray-500 mt-1">ID: {employeeData.employeeId}</p>
              
              {isEditing && (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Change Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.name}
                    onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <p className="text-gray-900 py-2">{employeeData.employeeId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={employeeData.phone}
                    onChange={(e) => setEmployeeData({...employeeData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <p className="text-gray-900 py-2">{employeeData.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <p className="text-gray-900 py-2">{employeeData.designation}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                <p className="text-gray-900 py-2">{employeeData.joinDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="py-2">
                  {employeeData.status && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      employeeData.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        employeeData.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {employeeData.status}
                    </span>
                  )}
                  {!employeeData.status && (
                    <span className="text-gray-500 text-sm">Status not available</span>
                  )}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
