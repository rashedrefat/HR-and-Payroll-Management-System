import { Navigate, Route, Routes } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import Overview from "../pages/OverviewPage";

// Layouts
import BlankLayout from "../layouts/BlankLayout";
import MainLayout from "../layouts/MainLayout";

// Pages
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import Dashboard from "../pages/Dashboard";

export default function Routers() {
  return (
    <Routes>
      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route index element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />
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
