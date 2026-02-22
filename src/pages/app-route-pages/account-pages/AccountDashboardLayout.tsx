import { Outlet } from "react-router";
import UserMenu from "@/components/custom/user-menu/UserMenu";
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
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  // Show org sidebar items if an org is selected, otherwise usr items
  const mainSections = selectedOrg
    ? getOrgNavSections(selectedOrg.code)
    : USR_MAIN_SECTIONS;
  const bottomSections = selectedOrg ? undefined : USR_BOTTOM_SECTIONS;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar (same as last context) ── */}
      <AppSidebar mainSections={mainSections} bottomSections={bottomSections} />

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <header className="flex items-center justify-between px-7 py-4 border-b border-gray-200 bg-white min-h-16">
          <h1 className="text-lg font-bold text-gray-900">
            Tài khoản người dùng
          </h1>
          <UserMenu />
        </header>

        <div className="flex-1 overflow-y-auto p-7 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
