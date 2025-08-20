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
    title: "Attendance List",
    icon: "/icons/attendance.svg",
    link: "attendance",
  },
  {
    title: "Office Notice",
    icon: "/icons/notice.svg",
    link: "notice",
  },
  {
    title: "Expense List",
    icon: "/icons/expense.svg",
    link: "expense",
  },
  {
    title: "Settings",
    icon: "/icons/settings.svg",
    link: "settings",
    extend: [
      { title: "Time Management", link: "settings/time-management" },
      { title: "Attendance Settings", link: "settings/attendance-settings" },
      { title: "Leave Settings", link: "settings/leave-settings" },
      { title: "Employee Settings", link: "settings/employee-settings" },
      { title: "Vacation", link: "settings/vacation" },

    ],
  },
  {
    title: "Payroll",
    icon: "/icons/payroll.svg",
    link: "payroll",
    extend: [
      { title: "Salary Settings", link: "payroll/salary-settings" },
      { title: "Salary List", link: "payroll/salary-list" },
      { title: "Increment", link: "payroll/increment" },
      { title: "Increment History", link: "payroll/increment-history" },
    ],
  },
    {
    title: "Timeline",
    icon: "/icons/timeline.svg",
    link: "timeline",
    
  },
  {
    title: "Reports",
    icon: "/icons/reports.svg",
    link: "reports",
    extend: [
      { title: "Expense Reports", link: "reports/expense-reports" },
      { title: "Attendance Reports", link: "reports/attendance-reports" },
      { title: "Leave Reports", link: "reports/leave-reports" },
      { title: "Visit Reports", link: "reports/visit-reports" },
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
