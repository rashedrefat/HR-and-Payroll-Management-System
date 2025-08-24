import { Navigate, Route, Routes } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import Overview from "../pages/OverviewPage";
import LandingPage from "../pages/LandingPage";

// Layouts
import BlankLayout from "../layouts/BlankLayout";
import MainLayout from "../layouts/MainLayout";

// Pages
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import Dashboard from "../pages/Dashboard";
import Company from "../pages/Company/Company";
import Allemployee from "../pages/AllEmployee";
import LeaveApplication from "../pages/LeaveApplication";
import AttendanceList from "../pages/AttendanceList";
import OfficeNotice from "../pages/OfficeNotice";
import ExpenseList from "../pages/expense/ExpenseList";
import TimeAttendanceSettings from "../pages/TimeAttendanceSettings";
import Settings from "../pages/Settings";
import LeaveSettings from "../pages/LeaveSettings";
import EmployeeSettings from "../pages/EmployeeSettings";
import Salary from "../pages/Salary";
import Payroll from "../pages/Payroll";
import Increment from "../pages/Increment";

export default function Routers() {
  return (
    <Routes>
      {/* Landing page without layout */}
      <Route path="/" element={<LandingPage />} />

      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route path="overview" element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="company" element={<Company />} />
        <Route path="employee">
          <Route index element={<Allemployee />} />
        </Route>
        <Route path="leave">
          <Route index element={<LeaveApplication />} />
        </Route>
        <Route path="attendance">
          <Route index element={<AttendanceList />} />
        </Route>
        <Route path="notice">
          <Route index element={<OfficeNotice />} />
        </Route>
        <Route path="expense">
          <Route index element={<ExpenseList />} />
        </Route>
        <Route path="settings">
          <Route index element={<Settings />} />
          <Route path="time-attendance" element={<TimeAttendanceSettings />} />
          <Route path="leave-settings" element={<LeaveSettings />} />
          <Route path="employee-settings" element={<EmployeeSettings />} />
        </Route>
        <Route path="payroll">
          <Route index element={<Payroll />} />
          <Route path="salary-settings" element={<Salary />} />
          <Route path="increment" element={<Increment />} />
        </Route>
      </Route>

      {/* Blank layout routes */}
      <Route element={<BlankLayout />}>
        <Route path="signup" element={<Registration />} />
        <Route path="signin" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
