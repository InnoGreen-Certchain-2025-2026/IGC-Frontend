import { NavLink, useNavigate, useParams } from "react-router";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ScrollText,
  Settings,
  ArrowLeft,
  Building2,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getOrganizationByIdApi } from "@/services/organizationService";
import type { OrganizationResponse } from "@/types/organization/OrganizationResponse";
import { getS3Url } from "@/lib/utils";

const NAV_ITEMS = [
  {
    to: "",
    label: "Tổng quan",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "members",
    label: "Thành viên",
    icon: Users,
    end: false,
  },
  {
    to: "roles",
    label: "Vai trò & Quyền",
    icon: ShieldCheck,
    end: false,
  },
  {
    to: "certificates",
    label: "Chứng chỉ",
    icon: ScrollText,
    end: false,
  },
  {
    to: "settings",
    label: "Cài đặt",
    icon: Settings,
    end: false,
  },
];

/**
 * Sidebar component for the organization dashboard.
 * Fetches org info and displays navigation links specific to managing an organization.
 */
export default function OrgSidebar() {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [org, setOrg] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    getOrganizationByIdApi(Number(orgId))
      .then((res) => {
        if (res.data) setOrg(res.data);
      })
      .catch(() => {
        // silently fail — layout header can still work
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  return (
    <aside className="w-[272px] min-w-[272px] bg-linear-to-b from-[#004D40] to-[#00251A] text-white flex flex-col overflow-y-auto">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-4 text-lg font-bold tracking-tight border-b border-white/12">
        <img
          src="/favicon/web-logo.png"
          alt="IGC Logo"
          className="h-9 w-9 object-contain"
        />
        <span>IGC Platform</span>
      </div>

      {/* Organization info */}
      <div className="px-4 pt-4 pb-3 border-b border-white/12">
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-white/50" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center overflow-hidden shrink-0">
              {org?.logoUrl ? (
                <img
                  src={getS3Url(org.logoUrl)}
                  alt={org.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-white/60" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {org?.name ?? "Tổ chức"}
              </p>
              <p className="text-[0.7rem] text-white/50 truncate">
                {org?.code ?? ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pt-3 pb-1.5 font-semibold">
          Quản lý
        </span>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={`/org/${orgId}/${item.to}`}
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

        {/* Back to user dashboard */}
        <div className="mt-auto pt-4 flex flex-col gap-0.5">
          <span className="text-[0.7rem] uppercase tracking-wider text-white/45 px-2 pb-1.5 font-semibold">
            Điều hướng
          </span>
          <button
            onClick={() => navigate("/usr/organizations")}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white no-underline transition-all duration-150 bg-transparent border-none cursor-pointer text-left w-full [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:shrink-0"
          >
            <ArrowLeft />
            Quay lại Dashboard
          </button>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-white/12 text-[0.7rem] text-white/40 text-center">
        © 2026 InnoGreen Certchain
      </div>
    </aside>
  );
}
