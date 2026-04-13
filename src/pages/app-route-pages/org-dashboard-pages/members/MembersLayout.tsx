import { useParams, NavLink, Outlet } from "react-router";

/**
 * Layout for organization members management.
 * Provides tabs to switch between active members and pending invites.
 */
export default function MembersLayout() {
  const { orgCode } = useParams<{ orgCode: string }>();

  const TABS = [
    { to: `/org/${orgCode}/members`, label: "Danh sách", end: true },
    { to: `/org/${orgCode}/members/invites`, label: "Lời mời", end: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#214e41]">
          Thành viên
        </h2>
        <p className="text-slate-600">
          Quản lý thành viên và các lời mời tham gia tổ chức.
        </p>
      </div>

      {/* Internal Tabs */}
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

      {/* Sub-page content */}
      <Outlet />
    </div>
  );
}
