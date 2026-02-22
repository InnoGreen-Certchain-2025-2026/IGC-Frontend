import { Outlet, useLocation, useParams } from "react-router";
import UserMenu from "@/components/custom/user-menu/UserMenu";
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
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <OrgSidebar />

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <header className="flex items-center justify-between px-7 py-4 border-b border-gray-200 bg-white min-h-16">
          <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
          <UserMenu />
        </header>

        <div className="flex-1 overflow-y-auto p-7 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
