// sidebar links for admin (starter template)
export const adminLinks = [
  {
    title: "Dashboard",
    icon: "/icons/Dash2.svg",
    link: "dashboard",
  },
  {
    title: "Company",
    icon: "/icons/Company.svg",
    link: "company",
    
  },
  {
    title: "All Employee",
    icon: "/icons/employee.svg",
    link: "employee",
    
  },
  {
    title: "Leave Application",
    icon: "/icons/leave.svg",
    link: "leave",
  },
  {
    title: "Attendance",
    icon: "/icons/attendance.svg",
    link: "attendance",
  },
    {
    title: "Payroll",
    icon: "/icons/payroll.svg",
    link: "payroll",
    extend: [
      { title: "Salary", link: "payroll/salary-settings", icon: "/icons/money.svg" },
      { title: "Increment", link: "payroll/increment", icon: "/icons/moneybag.svg" },
    ],
  },
  {
    title: "Settings",
    icon: "/icons/settings.svg",
    link: "settings",
    extend: [
      { title: "Shift Settings", link: "settings/shift-settings", icon: "/icons/attendance.svg" },
      { title: "Leave Settings", link: "settings/leave-settings", icon: "/icons/leave.svg" },
      { title: "Employee Settings", link: "settings/employee-settings", icon: "/icons/employee.svg" },
    ],
  },

];

export const defaultImage = "/images/profile-photo.jpg"; // Replace with your actual photo filename

// default data for table and dropdown's
export const productCategories = [
  { label: "Design", value: "Design" },
  { label: "Development", value: "Development" },
  { label: "Marketing", value: "Marketing" },
  { label: "Finance", value: "Finance" },
  { label: "HR", value: "HR" },
];
