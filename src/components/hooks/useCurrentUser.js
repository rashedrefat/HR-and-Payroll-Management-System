import { useAuth } from "./useAuth";

export function useCurrentUser() {
  const { user } = useAuth();
  
  // Return formatted user data for employee profile
  if (!user) {
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