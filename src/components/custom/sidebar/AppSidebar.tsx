import { NavLink } from "react-router";
import { UserCircle } from "lucide-react";
import OrganizationSelector from "@/pages/app-route-pages/user-dashboard-pages/components/OrganizationSelector";
import type { NavSectionConfig } from "./navTypes";

interface AppSidebarProps {
  mainSections: NavSectionConfig[];
  bottomSections?: NavSectionConfig[];
}

/**
 * Shared sidebar used across user dashboard, org dashboard, and account pages.
 * Branding + Org Selector + dynamic nav sections + account link + footer.
 */
export default function AppSidebar({
  mainSections,
  bottomSections,
}: AppSidebarProps) {
  return (
    <aside className="w-[272px] min-w-[272px] bg-linear-to-b from-[#002B5B] to-[#001D3D] text-white flex flex-col overflow-y-auto">
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

      {/* Main navigation sections */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {mainSections.map((section) => (
          <div key={section.title}>
            <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pt-3 pb-1.5 font-semibold block">
              {section.title}
            </span>
            {section.items.map((item) => (
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
          </div>
        ))}

        {/* Bottom sections + Account link */}
        <div className="mt-auto pt-4 flex flex-col gap-0.5">
          {bottomSections?.map((section) => (
            <div key={section.title}>
              <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pb-1.5 font-semibold block">
                {section.title}
              </span>
              {section.items.map((item) => (
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
            </div>
          ))}

          {/* Account link (always present) */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:shrink-0 ${
                isActive
                  ? "bg-white/18 text-white font-semibold"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <UserCircle />
            Tài khoản
          </NavLink>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-white/12 text-[0.7rem] text-white/40 text-center">
        © 2026 InnoGreen Certchain
      </div>
    </aside>
  );
}
