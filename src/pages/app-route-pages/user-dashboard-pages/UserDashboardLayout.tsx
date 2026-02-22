import { Outlet, useLocation } from "react-router";
import UserMenu from "@/components/custom/user-menu/UserMenu";
import Sidebar from "./components/Sidebar";

/** Returns a page title based on the current pathname */
function usePageTitle(): string {
  const { pathname } = useLocation();
  if (pathname.includes("/certificates")) return "Danh sách bằng cấp";
  if (pathname.includes("/organizations")) return "Quản lý tổ chức";
  return "Tổng quan";
}

/**
 * Main layout for the user dashboard.
 * Deep-blue sidebar with navigation + white content area rendering child routes.
 */
export default function UserDashboardLayout() {
  const pageTitle = usePageTitle();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <Sidebar />

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
