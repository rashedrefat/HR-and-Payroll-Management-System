import { useMemo } from 'react';
import { useGetEmployeeProfileQuery } from '../../features/api/employeeApiSlice';

export const useCurrentEmployee = () => {
  const { data: employeeData, isLoading, error } = useGetEmployeeProfileQuery();

  // Debug logging
  console.log('useCurrentEmployee - isLoading:', isLoading);
  console.log('useCurrentEmployee - error:', error);
  console.log('useCurrentEmployee - employeeData:', employeeData);
  if (employeeData) {
    console.log('useCurrentEmployee - designation specifically:', employeeData.designation);
    console.log('useCurrentEmployee - department specifically:', employeeData.department);
  }

  const formattedEmployeeData = useMemo(() => {
    if (isLoading) {
      return {
        fullName: 'Loading...',
        name: 'Loading...',
        empId: 'Loading...',
        employeeId: 'Loading...',
        department: 'Loading...',
        designation: 'Loading...',
        email: 'Loading...',
        phone: 'Loading...',
        mobile: 'Loading...',
        joinDate: 'Loading...',
        joiningDate: 'Loading...',
        profilePicture: '/images/profile-photo.jpg', // Default image
        image: '/images/profile-photo.jpg',
        status: null,
        isLoading: true,
        error: null
      };
    }

    if (error) {
      console.error('Employee profile fetch error:', error);
      return {
        fullName: 'Error',
        name: 'Error',
        empId: 'Error',
        employeeId: 'Error',
        department: 'Error',
        designation: 'Error',
        email: 'Error',
        phone: 'Error',
        mobile: 'Error',
        joinDate: 'Error',
        joiningDate: 'Error',
        profilePicture: '/images/profile-photo.jpg',
        image: '/images/profile-photo.jpg',
        status: null,
        isLoading: false,
        error: error
      };
    }

    if (!employeeData) {
      return {
        fullName: 'No Data',
        name: 'No Data',
        empId: 'No Data',
        employeeId: 'No Data',
        department: 'No Data',
        designation: 'No Data',
        email: 'No Data',
        phone: 'No Data',
        mobile: 'No Data',
        joinDate: 'No Data',
        joiningDate: 'No Data',
        profilePicture: '/images/profile-photo.jpg', // Default image
        image: '/images/profile-photo.jpg',
        status: null,
        isLoading: false,
        error: null
      };
    }

    // Format the employee data for consistent use across components
    return {
      // Different naming conventions for compatibility
      fullName: employeeData.name,
      name: employeeData.name,
      empId: employeeData.employee_id,
      employeeId: employeeData.employee_id,
      department: employeeData.department,
      departmentId: employeeData.department_id,
      designation: employeeData.designation,
      designationId: employeeData.designation_id,
      email: employeeData.email,
      phone: employeeData.mobile,
      mobile: employeeData.mobile,
      joinDate: employeeData.joining_date,
      joiningDate: employeeData.joining_date,
      // Use the full image URL from backend or fallback to default
      profilePicture: employeeData.image || '/images/profile-photo.jpg',
      image: employeeData.image || '/images/profile-photo.jpg',
      status: employeeData.status,
      isActive: employeeData.status === 1,
      
      // Additional metadata
      isLoading: false,
      error: null,
      
      // Raw data for advanced use cases
      rawData: employeeData
    };
  }, [employeeData, isLoading, error]);

  return {
    ...formattedEmployeeData,
    isLoading,
    error,
    refetch: () => {
      // Re-fetch employee data if needed
    }
  };
};