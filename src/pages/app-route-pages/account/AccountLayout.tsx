import { NavLink, Outlet, Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/features/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/lib/utils";

const TABS = [
  { to: "/user-dashboard/account/profile", label: "Hồ sơ" },
  { to: "/user-dashboard/account/security", label: "Bảo mật" },
];

/**
 * Account layout with avatar header and tab navigation.
 * Renders profile / security sub-pages via <Outlet />.
 */
export default function AccountLayout() {
  const { name, email, avatarUrl } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();

  /* Redirect bare /account to /account/profile */
  if (pathname === "/user-dashboard/account") {
    return <Navigate to="/user-dashboard/account/profile" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Avatar header ── */}
      <div className="flex flex-col items-center gap-2 pt-2 pb-6">
        <Avatar className="h-24 w-24 shadow-md">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? ""} />}
          <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl font-bold">
            {getAvatarFallback(name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{name ?? "Người dùng"}</p>
          <p className="text-sm text-gray-500">{email ?? ""}</p>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex justify-center border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* ── Sub-page content ── */}
      <Outlet />
    </div>
  );
}
