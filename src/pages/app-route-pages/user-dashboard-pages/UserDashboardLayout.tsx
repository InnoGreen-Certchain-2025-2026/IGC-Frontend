import { Outlet, useLocation } from "react-router";
import UserMenu from "@/components/custom/user-menu/UserMenu";
import LanguageToggle from "@/components/custom/header/LanguageToggle";
import Sidebar from "./components/Sidebar";

import { useTranslation } from "react-i18next";

/** Returns a page title based on the current pathname */
function usePageTitle(): string {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  if (pathname.includes("/certificates")) return t("dashboard.header.titles.certificates", "Danh sách bằng cấp");
  if (pathname.includes("/organizations")) return t("dashboard.header.titles.organizations", "Quản lý tổ chức");
  return t("dashboard.header.titles.overview", "Tổng quan");
}

/**
 * Main layout for the user dashboard.
 * Deep-blue sidebar with navigation + white content area rendering child routes.
 */
export default function UserDashboardLayout() {
  const pageTitle = usePageTitle();

  return (
    <div className="igc-app-theme flex h-screen overflow-hidden bg-[#edf4f0]">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col bg-[#f8fbf9] overflow-hidden">
        <header className="flex items-center justify-between px-7 py-4 border-b border-[#d2e1da] bg-white/95 min-h-16 backdrop-blur-sm">
          <h1 className="text-lg font-bold text-[#214e41]">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <UserMenu />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-7 bg-[#eef5f1]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
