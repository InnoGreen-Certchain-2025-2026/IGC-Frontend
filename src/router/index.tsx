import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";
import UserDashboard from "@/pages/app-route-pages/user-dashboard";
import AdminDashboard from "@/pages/app-route-pages/admin-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/landing-page" replace />,
  },
  {
    path: "/landing-page",
    element: <LandingPage />,
  },
  {
    path: "/auth-page",
    element: <AuthPage />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);
