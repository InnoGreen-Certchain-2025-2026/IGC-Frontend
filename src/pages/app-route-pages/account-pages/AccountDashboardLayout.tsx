import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import UserMenu from "@/components/custom/user-menu/UserMenu";
import LanguageToggle from "@/components/custom/header/LanguageToggle";
import AppSidebar from "@/components/custom/sidebar/AppSidebar";
import { useAppSelector } from "@/features/hooks";
import {
  USR_MAIN_SECTIONS,
  USR_BOTTOM_SECTIONS,
} from "@/components/custom/sidebar/usrNavItems";
import { getOrgNavSections } from "@/components/custom/sidebar/orgNavItems";

/**
 * Layout for the standalone /account route.
 * Renders the same shared sidebar (preserving the usr/org context)
 * alongside account sub-pages.
 */
export default function AccountDashboardLayout() {
  const { t } = useTranslation();
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  // Show org sidebar items if an org is selected, otherwise usr items
  const mainSections = selectedOrg
    ? getOrgNavSections(selectedOrg.code)
    : USR_MAIN_SECTIONS;
  const bottomSections = selectedOrg ? undefined : USR_BOTTOM_SECTIONS;

  return (
    <div className="igc-app-theme flex h-screen overflow-hidden bg-[#edf4f0]">
      {/* ── Sidebar (same as last context) ── */}
      <AppSidebar mainSections={mainSections} bottomSections={bottomSections} />

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col bg-[#f8fbf9] overflow-hidden">
        <header className="flex items-center justify-between px-7 py-4 border-b border-[#d2e1da] bg-white/95 min-h-16 backdrop-blur-sm">
          <h1 className="text-lg font-bold text-[#214e41]">
            {t("dashboard.header.titles.account", "Tài khoản người dùng")}
          </h1>
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
