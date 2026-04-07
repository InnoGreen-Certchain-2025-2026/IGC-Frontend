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
    <aside className="flex w-68 min-w-68 flex-col overflow-y-auto border-r border-slate-200 bg-white/95 text-slate-800 shadow-[0_0_0_1px_rgba(15,23,42,0.02),0_12px_40px_rgba(15,23,42,0.04)] bg-linear-to-b from-white to-primary-200">
      {/* Branding */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 pt-6 pb-4 text-lg font-bold tracking-tight bg-linear-to-r from-slate-50 to-transparent">
        <img
          src="/favicon/web-logo.png"
          alt="IGC Logo"
          className="h-9 w-9 object-contain"
        />
        <span className="font-display text-slate-900">IGC Platform</span>
      </div>

      {/* Organization selector */}
      <OrganizationSelector />

      {/* Main navigation sections */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {mainSections.map((section) => (
          <div key={section.title}>
            <span className="block px-2 pt-3 pb-1.5 text-[0.68rem] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              {section.title}
            </span>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 mt-1 rounded-xl border-l-2 px-3.5 py-2.75 text-sm font-medium no-underline transition-all duration-150 [&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:shrink-0 ${
                    isActive
                      ? "border-primary-500 bg-primary-50 text-primary-800 font-semibold shadow-[0_4px_18px_rgba(35,111,70,0.08)]"
                      : "border-transparent text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
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
        <div className="mt-auto flex flex-col gap-0.5 pt-4">
          {bottomSections?.map((section) => (
            <div key={section.title}>
              <span className="block px-2 pb-1.5 text-[0.68rem] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                {section.title}
              </span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl border-l-2 px-3.5 py-2.75 text-sm font-medium no-underline transition-all duration-150 [&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:shrink-0 ${
                      isActive
                      ? "border-primary-500 bg-primary-50 text-primary-800 font-semibold shadow-[0_4px_18px_rgba(35,111,70,0.08)]"
                      : "border-transparent text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
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
              `group flex items-center gap-3 mt-1 rounded-xl border-l-2 px-3.5 py-2.75 text-sm font-medium no-underline transition-all duration-150 [&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:shrink-0 ${
                isActive
                  ? "border-primary-500 bg-primary-50 text-primary-800 font-semibold shadow-[0_4px_18px_rgba(35,111,70,0.08)]"
                  : "border-transparent text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-800 hover:shadow-sm"
              }`
            }
          >
            <UserCircle />
            Tài khoản
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-slate-200 px-4 py-3 text-center text-[0.7rem] text-slate-500">
        © 2026 InnoGreen Certchain
      </div>
    </aside>
  );
}
