import { useAuth } from "./useAuth";

export function useCurrentAdminUser() {
  const { user } = useAuth();
  
  // Return formatted user data for admin profile
  if (!user || user.role_id !== 2) {
    return {
      fullName: "",
      empId: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joinDate: "",
      address: "",
      profilePicture: ""
    };
  }

  return {
    fullName: user.name || "",
    empId: user.employee_id || "",
    email: user.email || "",
    phone: user.phone || "",
    department: user.department?.name || "",
    designation: user.designation?.name || "",
    joinDate: user.joining_date || "",
    address: user.address || "",
    profilePicture: user.profile_picture || ""
  };
}