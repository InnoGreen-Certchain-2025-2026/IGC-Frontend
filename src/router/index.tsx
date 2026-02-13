import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";
import AdminDashboard from "@/pages/app-route-pages/admin-dashboard";

import ProtectedRoute from "@/components/custom/protected-route/ProtectedRoute";
import PublicOnlyRoute from "@/components/custom/protected-route/PublicOnlyRoute";

import UserDashboardLayout from "@/pages/app-route-pages/user-dashboard/UserDashboardLayout";
import GeneralPage from "@/pages/app-route-pages/user-dashboard/general";
import CertificatesPage from "@/pages/app-route-pages/user-dashboard/certificates";
import AccountPage from "@/pages/app-route-pages/user-dashboard/account";

export const router = createBrowserRouter([
  /* Redirect root */
  {
    path: "/",
    element: <Navigate to="/landing-page" replace />,
  },

  /* Public-only routes — authenticated users are redirected to dashboard */
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/landing-page", element: <LandingPage /> },
      { path: "/auth", element: <AuthPage /> },
    ],
  },

  /* Protected routes — unauthenticated users are redirected to /auth */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/user-dashboard",
        element: <UserDashboardLayout />,
        children: [
          { index: true, element: <GeneralPage /> },
          { path: "certificates", element: <CertificatesPage /> },
          { path: "account", element: <AccountPage /> },
        ],
      },
      { path: "/admin-dashboard", element: <AdminDashboard /> },
    ],
  },

  /* Catch-all */
  {
    path: "*",
    element: <Navigate to="/landing-page" replace />,
  },
]);
