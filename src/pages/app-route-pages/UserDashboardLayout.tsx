import { NavLink, Outlet, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ScrollText,
  UserCircle,
  ChevronsUpDown,
  Check,
  Settings,
  Plus,
  Building2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import UserMenu from "@/components/custom/user-menu/UserMenu";

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

/** Dummy organization list */
const ORGANIZATIONS = [
  { id: "personal", label: "Cá nhân" },
];

/** Returns a page title based on the current pathname */
function usePageTitle(): string {
  const { pathname } = useLocation();
  if (pathname.includes("/certificates")) return "Danh sách bằng cấp";
  if (pathname.includes("/account")) return "Tài khoản người dùng";
  if (pathname.includes("/organizations")) return "Quản lý tổ chức";
  return "Tổng quan";
}

/**
 * Main layout for the user dashboard.
 * Deep-blue sidebar with navigation + white content area rendering child routes.
 */
export default function UserDashboardLayout() {
  const [activeOrganization, setActiveOrganization] = useState("personal");
  const [orgOpen, setOrgOpen] = useState(false);
  const pageTitle = usePageTitle();

  const currentOrg = ORGANIZATIONS.find((w) => w.id === activeOrganization);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-[272px] min-w-[272px] bg-gradient-to-b from-[#002B5B] to-[#001D3D] text-white flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-4 text-lg font-bold tracking-tight border-b border-white/12">
          <div className="w-9 h-9 bg-white/18 rounded-[10px] flex items-center justify-center text-base">🔗</div>
          <span>IGC Platform</span>
        </div>

        {/* Organization selector */}
        <div className="px-4 pt-4 pb-2">
          <label className="block text-[0.7rem] uppercase tracking-wider text-white/55 mb-1.5 font-semibold">
            Tổ chức
          </label>
          <Popover open={orgOpen} onOpenChange={setOrgOpen}>
            <PopoverTrigger asChild>
              <button className="w-full bg-white/10 border border-white/15 text-white rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between gap-2 hover:bg-white/18 focus:bg-white/18">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {currentOrg?.label ?? "Chọn tổ chức"}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-60 flex-shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[240px] p-0"
              side="bottom"
              align="start"
              sideOffset={6}
            >
              {/* Header */}
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Chuyển tổ chức
                </p>
              </div>
              <Separator />

              {/* Organization list */}
              <div className="py-1">
                {ORGANIZATIONS.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setActiveOrganization(org.id);
                      setOrgOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100"
                  >
                    {activeOrganization === org.id ? (
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <span className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span>{org.label}</span>
                  </button>
                ))}
              </div>

              <Separator />

              {/* Actions */}
              <div className="py-1">
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.82rem] font-medium text-gray-500 bg-transparent border-none cursor-pointer text-left transition-all duration-100 hover:bg-gray-100 hover:text-gray-900">
                  <Settings className="h-4 w-4" />
                  Quản lý tổ chức
                </button>
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.82rem] font-medium text-gray-500 bg-transparent border-none cursor-pointer text-left transition-all duration-100 hover:bg-gray-100 hover:text-gray-900">
                  <Plus className="h-4 w-4" />
                  Tạo tổ chức mới
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

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
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:flex-shrink-0 ${
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
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:flex-shrink-0 ${
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
