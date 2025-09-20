import React, { useState, useMemo } from "react";
import { useCurrentEmployee } from "../../components/hooks/useCurrentEmployee";
import { useAuth } from "../../components/hooks/useAuth";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const isAdmin = user?.role_id === 2;
  
  // Use the current employee hook to get actual employee data
  const currentEmployee = useCurrentEmployee();
  
  const initialEmployeeData = useMemo(() => {
    return {
      name: currentEmployee.name || currentEmployee.fullName,
      employeeId: currentEmployee.employeeId || currentEmployee.empId,
      email: currentEmployee.email,
      phone: currentEmployee.phone || currentEmployee.mobile,
      department: currentEmployee.department,
      designation: currentEmployee.designation,
      joinDate: currentEmployee.joinDate || currentEmployee.joiningDate,
      status: currentEmployee.status,
      profilePicture: currentEmployee.profilePicture || currentEmployee.image,
    };
  }, [currentEmployee]);

  const [employeeData, setEmployeeData] = useState(initialEmployeeData);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
    // In a real app, you would make an API call here
    console.log("Profile updated:", employeeData);
  };

  // Show loading state while employee data is being fetched
  if (currentEmployee.isLoading) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (currentEmployee.error) {
    return (
      <section className="px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600">Unable to load employee profile data. Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
            {isAdmin ? 'Admin Profile' : 'My Profile'}
          </h1>
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
                src={employeeData.profilePicture || '/images/profile-photo.jpg'}
                alt={employeeData.name || 'Employee'}
                onError={(e) => {
                  e.target.src = '/images/profile-photo.jpg';
                }}
              />
              <h2 className="text-xl font-bold text-gray-900 mt-4">{employeeData.name || 'Loading...'}</h2>
              <p className="text-gray-600">{employeeData.designation || 'Loading...'}</p>
              <p className="text-sm text-gray-500 mt-1">ID: {employeeData.employeeId || 'Loading...'}</p>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdmin ? 'Admin ID' : 'Employee ID'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.employeeId}
                    onChange={(e) => setEmployeeData({...employeeData, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.employeeId}</p>
                )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdmin ? 'Role' : 'Department'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.department}
                    onChange={(e) => setEmployeeData({...employeeData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdmin ? 'Position' : 'Designation'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.designation}
                    onChange={(e) => setEmployeeData({...employeeData, designation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.designation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdmin ? 'Account Created' : 'Join Date'}
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={employeeData.joinDate}
                    onChange={(e) => setEmployeeData({...employeeData, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employeeData.joinDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={employeeData.status}
                    onChange={(e) => setEmployeeData({...employeeData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employeeData.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employeeData.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
