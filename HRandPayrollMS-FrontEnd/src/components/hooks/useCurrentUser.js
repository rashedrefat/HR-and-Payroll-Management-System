import { useAuth } from "./useAuth";

export function useCurrentUser() {
  const { user } = useAuth();
  
  // Return formatted user data for employee profile
  if (!user) {
    return {
      fullName: "",
      firstName: "",
      empId: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joinDate: "",
      address: "",
      profilePicture: "/images/profile-photo.jpg"
    };
  }

  return {
    fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "",
    firstName: user.firstName || user.name?.split(' ')[0] || "",
    empId: user.employee_id || "",
    email: user.email || "",
    phone: user.phone || "",
    department: user.department?.name || "",
    designation: user.designation?.name || "",
    joinDate: user.joining_date || "",
    address: user.address || "",
    profilePicture: user.profile_picture || user.image || "/images/profile-photo.jpg"
  };
}