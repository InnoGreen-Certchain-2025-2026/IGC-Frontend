import { useParams, NavLink, Outlet } from "react-router";

/**
 * Layout for organization certificates section.
 */
export default function OrgCertificatesPage() {
  const { orgCode } = useParams<{ orgCode: string }>();

  const TABS = [
    { to: `/org/${orgCode}/certificates`, label: "Tổng quan", end: true },
    {
      to: `/org/${orgCode}/certificates/templates/new`,
      label: "Tạo template",
      end: true,
    },
    {
      to: `/org/${orgCode}/certificates/templates`,
      label: "Danh sách template",
      end: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#214e41]">
            Chứng chỉ
          </h2>
          <p className="text-slate-600">
            Quản lý chứng chỉ và bằng cấp do tổ chức cấp phát.
          </p>
        </div>
      </header>

      {/* internal tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium transition-colors duration-150 border-b-3 -mb-px whitespace-nowrap ${
                isActive
                  ? "border-[#183930] text-[#214e41]"
                  : "border-transparent text-slate-600 hover:text-[#214e41] hover:border-[#183930]"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* outlet for subpages */}
      <Outlet />
    </div>
  );
}
