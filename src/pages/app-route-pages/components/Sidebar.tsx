import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ScrollText,
  UserCircle,
  Building2,
} from "lucide-react";
import OrganizationSelector from "./OrganizationSelector";

const MAIN_NAV_ITEMS = [
  {
    to: "/user-dashboard",
    label: "Chung",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/user-dashboard/certificates",
    label: "Danh sách bằng cấp",
    icon: ScrollText,
    end: false,
  },
];

const BOTTOM_NAV_ITEMS = [
  {
    to: "/user-dashboard/organizations",
    label: "Tổ chức",
    icon: Building2,
    end: false,
  },
  {
    to: "/user-dashboard/account",
    label: "Tài khoản người dùng",
    icon: UserCircle,
    end: false,
  },
];

/**
 * Sidebar component for the user dashboard.
 * Contains branding, organization selector, and navigation links.
 */
export default function Sidebar() {
  return (
    <aside className="w-[272px] min-w-[272px] bg-gradient-to-b from-[#002B5B] to-[#001D3D] text-white flex flex-col overflow-y-auto">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-4 text-lg font-bold tracking-tight border-b border-white/12">
        <img
          src="/favicon/web-logo.png"
          alt="IGC Logo"
          className="h-9 w-9 object-contain"
        />
        <span>IGC Platform</span>
      </div>

      {/* Organization selector */}
      <OrganizationSelector />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pt-3 pb-1.5 font-semibold">
          Danh mục
        </span>
        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:shrink-0 ${
                isActive
                  ? "bg-white/18 text-white font-semibold"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}

        {/* Bottom section */}
        <div className="mt-auto pt-4 flex flex-col gap-0.5">
          <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pb-1.5 font-semibold">
            Cài đặt
          </span>
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:shrink-0 ${
                  isActive
                    ? "bg-white/18 text-white font-semibold"
                    : "text-white/78 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-white/12 text-[0.7rem] text-white/40 text-center">
        © 2026 InnoGreen Certchain
      </div>
    </aside>
  );
}
