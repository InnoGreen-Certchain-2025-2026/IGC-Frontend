import { NavLink } from "react-router";
import { UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <aside className="w-68 min-w-68 bg-linear-to-b from-[#214e41] to-[#183930] text-white flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-4 text-lg font-bold tracking-tight border-b border-white/15">
        <img
          src="/logo/logo_icon.png"
          alt="CertChain Icon"
          className="h-20 w-20 object-cover"
        />
        <span>CertChain Platform</span>
      </div>

      {/* Organization selector */}
      <OrganizationSelector />

      {/* Main navigation sections */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {mainSections.map((section) => (
          <div key={section.title}>
            <span className="text-[0.7rem] uppercase tracking-wider text-white/55 px-2 pt-3 pb-1.5 font-semibold block">
              {t(section.title, section.title)}
            </span>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:shrink-0 ${
                    isActive
                      ? "bg-[#f2ce3c]/20 text-[#f2ce3c] font-semibold"
                      : "text-white/82 hover:bg-white/12 hover:text-white"
                  }`
                }
              >
                <item.icon />
                {t(item.label, item.label)}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Bottom sections + Account link */}
        <div className="mt-auto pt-4 flex flex-col gap-0.5">
          {bottomSections?.map((section) => (
            <div key={section.title}>
              <span className="text-[0.7rem] uppercase tracking-wider text-white/55 px-2 pb-1.5 font-semibold block">
                {t(section.title, section.title)}
              </span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:shrink-0 ${
                      isActive
                        ? "bg-[#f2ce3c]/20 text-[#f2ce3c] font-semibold"
                        : "text-white/82 hover:bg-white/12 hover:text-white"
                    }`
                  }
                >
                  <item.icon />
                  {t(item.label, item.label)}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Account link (always present) */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150 [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:shrink-0 ${
                isActive
                  ? "bg-[#f2ce3c]/20 text-[#f2ce3c] font-semibold"
                  : "text-white/82 hover:bg-white/12 hover:text-white"
              }`
            }
          >
            <UserCircle />
            {t("dashboard.sidebar.account", "Tài khoản")}
          </NavLink>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-white/15 text-[0.7rem] text-white/50 text-center">
        © 2026 CertChain
      </div>
    </aside>
  );
}
