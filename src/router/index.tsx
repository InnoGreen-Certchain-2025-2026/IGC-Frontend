import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "@/pages/public-route-pages/landing-page";
import AuthPage from "@/pages/public-route-pages/auth-page";

import ProtectedRoute from "@/components/custom/protected-route/ProtectedRoute";
import PublicOnlyRoute from "@/components/custom/protected-route/PublicOnlyRoute";

// ── User Dashboard ──
import UserDashboardLayout from "@/pages/app-route-pages/user-dashboard-pages/UserDashboardLayout";
import GeneralPage from "@/pages/app-route-pages/user-dashboard-pages/general";
import CertificatesPage from "@/pages/app-route-pages/user-dashboard-pages/certificates";
import OrganizationsPage from "@/pages/app-route-pages/user-dashboard-pages/organizations";
import CreateOrganizationPage from "@/pages/app-route-pages/user-dashboard-pages/create-organization";

// ── Organization Dashboard ──
import OrgDashboardLayout from "@/pages/app-route-pages/org-dashboard-pages/OrgDashboardLayout";
import OrgOverviewPage from "@/pages/app-route-pages/org-dashboard-pages/overview";
import OrgMembersPage from "@/pages/app-route-pages/org-dashboard-pages/members";
import OrgInfoPage from "@/pages/app-route-pages/org-dashboard-pages/info";
import OrgCertificatesPage from "@/pages/app-route-pages/org-dashboard-pages/certificates";
import OrgSettingsPage from "@/pages/app-route-pages/org-dashboard-pages/settings";
import OrgInvitesPage from "@/pages/app-route-pages/org-dashboard-pages/invites";
import MembersLayout from "@/pages/app-route-pages/org-dashboard-pages/members/MembersLayout";

// ── Account (standalone) ──
import AccountDashboardLayout from "@/pages/app-route-pages/account-pages/AccountDashboardLayout";
import AccountLayout from "@/pages/app-route-pages/user-dashboard-pages/account/AccountLayout";
import ProfilePage from "@/pages/app-route-pages/user-dashboard-pages/account/profile";
import SecurityPage from "@/pages/app-route-pages/user-dashboard-pages/account/security";

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
        ],
      },

      /* ── Organization Dashboard ── */
      {
        path: "/org/:orgCode",
        element: <OrgDashboardLayout />,
        children: [
          { index: true, element: <OrgOverviewPage /> },
          { path: "info", element: <OrgInfoPage /> },
          {
            path: "members",
            element: <MembersLayout />,
            children: [
              { index: true, element: <OrgMembersPage /> },
              { path: "invites", element: <OrgInvitesPage /> },
            ],
          },
          { path: "certificates", element: <OrgCertificatesPage /> },
          { path: "settings", element: <OrgSettingsPage /> },
        ],
      },

      /* ── Account (standalone — sidebar preserves context) ── */
      {
        path: "/account",
        element: <AccountDashboardLayout />,
        children: [
          {
            element: <AccountLayout />,
            children: [
              { index: true, element: <ProfilePage /> },
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
    element: <Navigate to="/" replace />,
  },
]);
