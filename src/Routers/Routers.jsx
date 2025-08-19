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
import Allemployee from "../pages/Allemployee";

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
