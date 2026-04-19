import { Outlet, useLocation, useParams } from "react-router";
import UserMenu from "@/components/custom/user-menu/UserMenu";
import LanguageToggle from "@/components/custom/header/LanguageToggle";
import OrgSidebar from "./components/OrgSidebar";

/** Returns a page title based on the current pathname */
function useOrgPageTitle(): string {
  const { pathname } = useLocation();
  if (pathname.includes("/info")) return "Thông tin tổ chức";
  if (pathname.includes("/members")) return "Thành viên";
  if (pathname.includes("/invites")) return "Lời mời";
  if (pathname.includes("/certificates")) return "Chứng chỉ";
  if (pathname.includes("/settings")) return "Cài đặt tổ chức";
  return "Tổng quan tổ chức";
}

/**
 * Main layout for the organization dashboard.
 * Teal-green sidebar with org-specific navigation + white content area.
 */
export default function OrgDashboardLayout() {
  const pageTitle = useOrgPageTitle();
  const { orgCode } = useParams<{ orgCode: string }>();

  if (!orgCode) return null;

  return (
    <div className="certchain-app-theme flex h-screen overflow-hidden bg-[#edf4f0]">
      {/* ── Sidebar ── */}
      <OrgSidebar />

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
