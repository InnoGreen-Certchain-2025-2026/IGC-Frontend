import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

// Bỏ delay giả lập, sử dụng lazy thật sự để load nhanh nhất có thể
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fastLazy = (factory: () => Promise<any>) => lazy(factory);

const LandingPage = fastLazy(() => import("@/pages/public-route-pages/landing-page"));
const AuthPage = fastLazy(() => import("@/pages/public-route-pages/auth-page"));
import LoadingScreen from "@/components/common/LoadingScreen";

import ProtectedRoute from "@/components/custom/protected-route/ProtectedRoute";
import PublicOnlyRoute from "@/components/custom/protected-route/PublicOnlyRoute";

// ── User Dashboard ──
const UserDashboardLayout = fastLazy(() => import("@/pages/app-route-pages/user-dashboard-pages/UserDashboardLayout"));
import GeneralPage from "@/pages/app-route-pages/user-dashboard-pages/general";
import CertificatesPage from "@/pages/app-route-pages/user-dashboard-pages/certificates";
import OrganizationsPage from "@/pages/app-route-pages/user-dashboard-pages/organizations";
import CreateOrganizationPage from "@/pages/app-route-pages/user-dashboard-pages/create-organization";

// ── Organization Dashboard ──
const OrgDashboardLayout = fastLazy(() => import("@/pages/app-route-pages/org-dashboard-pages/OrgDashboardLayout"));
import OrgOverviewPage from "@/pages/app-route-pages/org-dashboard-pages/overview";
import OrgMembersPage from "@/pages/app-route-pages/org-dashboard-pages/members";
import OrgInfoPage from "@/pages/app-route-pages/org-dashboard-pages/info";
import OrgCertificatesPage from "@/pages/app-route-pages/org-dashboard-pages/certificates";
import OrgSettingsPage from "@/pages/app-route-pages/org-dashboard-pages/settings";
import OrgInvitesPage from "@/pages/app-route-pages/org-dashboard-pages/invites";
import MembersLayout from "@/pages/app-route-pages/org-dashboard-pages/members/MembersLayout";
import CertificateManagementPage from "@/pages/certificates/CertificateManagementPage";
import CreateDraftPage from "@/pages/certificates/CreateDraftPage";
import ClaimVerificationPage from "@/pages/certificates/ClaimVerificationPage";
import VerifyCertificateFilePage from "@/pages/certificates/VerifyCertificateFilePage";
import TemplateListPage from "@/pages/certificates/TemplateListPage";
import TemplateCreatePage from "@/pages/certificates/TemplateCreatePage";
import TemplateEditPage from "@/pages/certificates/TemplateEditPage";
import TemplateDetailPage from "@/pages/certificates/TemplateDetailPage";
import TemplateBatchPage from "@/pages/certificates/TemplateBatchPage";
import OrgVerifyCertificatePage from "@/pages/app-route-pages/org-dashboard-pages/certificates/OrgVerifyCertificatePage";
import TemplateEditorPage from "@/pages/TemplateEditorPage";

// ── Account (standalone) ──
import AccountDashboardLayout from "@/pages/app-route-pages/account-pages/AccountDashboardLayout";
import AccountLayout from "@/pages/app-route-pages/user-dashboard-pages/account/AccountLayout";
import ProfilePage from "@/pages/app-route-pages/user-dashboard-pages/account/profile";
import SecurityPage from "@/pages/app-route-pages/user-dashboard-pages/account/security";

export const router = createBrowserRouter([
  {
    path: "/verify",
    element: <VerifyCertificateFilePage />,
  },
  {
    path: "/claim",
    element: <ClaimVerificationPage />,
  },
  {
    path: "/loading",
    element: <LoadingScreen />,
  },
  {
    path: "/verify/file",
    element: <VerifyCertificateFilePage />,
  },

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
          {
            path: "certificates",
            element: <OrgCertificatesPage />,
            children: [
              { index: true, element: <CertificateManagementPage /> },
              { path: "create-draft", element: <CreateDraftPage /> },
              { path: "templates", element: <TemplateListPage /> },
              { path: "templates/new", element: <TemplateCreatePage /> },
              {
                path: "templates/:templateId",
                element: <TemplateDetailPage />,
              },
              {
                path: "templates/:templateId/edit",
                element: <TemplateEditPage />,
              },
              {
                path: "template-editor/:templateId",
                element: <TemplateEditorPage />,
              },
              {
                path: "templates/:templateId/bulk",
                element: <TemplateBatchPage />,
              },
              { path: "template-editor", element: <TemplateCreatePage /> },
              { path: "verify", element: <OrgVerifyCertificatePage /> },
            ],
          },
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
