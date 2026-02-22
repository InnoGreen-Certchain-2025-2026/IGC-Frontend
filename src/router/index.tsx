import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";

import ProtectedRoute from "@/components/custom/protected-route/ProtectedRoute";
import PublicOnlyRoute from "@/components/custom/protected-route/PublicOnlyRoute";

// ── User Dashboard ──
import UserDashboardLayout from "@/pages/app-route-pages/user-dashboard-pages/UserDashboardLayout";
import GeneralPage from "@/pages/app-route-pages/user-dashboard-pages/general";
import CertificatesPage from "@/pages/app-route-pages/user-dashboard-pages/certificates";
import AccountLayout from "@/pages/app-route-pages/user-dashboard-pages/account/AccountLayout";
import ProfilePage from "@/pages/app-route-pages/user-dashboard-pages/account/profile";
import SecurityPage from "@/pages/app-route-pages/user-dashboard-pages/account/security";
import OrganizationsPage from "@/pages/app-route-pages/user-dashboard-pages/organizations";
import CreateOrganizationPage from "@/pages/app-route-pages/user-dashboard-pages/create-organization";

// ── Organization Dashboard ──
import OrgDashboardLayout from "@/pages/app-route-pages/org-dashboard-pages/OrgDashboardLayout";
import OrgOverviewPage from "@/pages/app-route-pages/org-dashboard-pages/overview";
import OrgMembersPage from "@/pages/app-route-pages/org-dashboard-pages/members";
import OrgRolesPage from "@/pages/app-route-pages/org-dashboard-pages/roles";
import OrgCertificatesPage from "@/pages/app-route-pages/org-dashboard-pages/certificates";
import OrgSettingsPage from "@/pages/app-route-pages/org-dashboard-pages/settings";

export const router = createBrowserRouter([
  /* Public-only routes — authenticated users are redirected to dashboard */
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/auth", element: <AuthPage /> },
    ],
  },

  /* Protected routes — unauthenticated users are redirected to /auth */
  {
    element: <ProtectedRoute />,
    children: [
      /* ── User Dashboard ── */
      {
        path: "/usr",
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

      /* ── Organization Dashboard ── */
      {
        path: "/org/:orgCode",
        element: <OrgDashboardLayout />,
        children: [
          { index: true, element: <OrgOverviewPage /> },
          { path: "members", element: <OrgMembersPage /> },
          { path: "roles", element: <OrgRolesPage /> },
          { path: "certificates", element: <OrgCertificatesPage /> },
          { path: "settings", element: <OrgSettingsPage /> },
        ],
      },
    ],
  },

  /* Catch-all */
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
