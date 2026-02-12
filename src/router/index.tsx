import { Routes, Route, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";
import UserDashboard from "@/pages/app-route-pages/user-dashboard";
import AdminDashboard from "@/pages/app-route-pages/admin-dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/auth-page" element={<AuthPage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      <Route path="*" element={<Navigate to="/landing-page" replace />} />
    </Routes>
  );
}
