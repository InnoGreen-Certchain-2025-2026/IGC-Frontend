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
        <h2 className="text-2xl font-bold tracking-tight">Thành viên</h2>
        <p className="text-gray-500">
          Quản lý thành viên và các lời mời tham gia tổ chức.
        </p>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
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

      {/* Sub-page content */}
      <Outlet />
    </div>
  );
}
