import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";

import ProtectedRoute from "@/components/custom/protected-route/ProtectedRoute";
import PublicOnlyRoute from "@/components/custom/protected-route/PublicOnlyRoute";

import UserDashboardLayout from "@/pages/app-route-pages/UserDashboardLayout";
import GeneralPage from "@/pages/app-route-pages/general";
import CertificatesPage from "@/pages/app-route-pages/certificates";
import AccountLayout from "@/pages/app-route-pages/account/AccountLayout";
import ProfilePage from "@/pages/app-route-pages/account/profile";
import SecurityPage from "@/pages/app-route-pages/account/security";
import OrganizationsPage from "@/pages/app-route-pages/organizations";
import CreateOrganizationPage from "@/pages/app-route-pages/create-organization";

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
          {
            path: "organizations",
            children: [
              { index: true, element: <OrganizationsPage /> },
              { path: "create", element: <CreateOrganizationPage /> },
            ],
          },
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              { path: "profile", element: <ProfilePage /> },
              { path: "security", element: <SecurityPage /> },
            ],
          },
        ],
      },
    ],
  },

  /* Catch-all */
  {
    path: "*",
    element: <Navigate to="/landing-page" replace />,
  },
]);
