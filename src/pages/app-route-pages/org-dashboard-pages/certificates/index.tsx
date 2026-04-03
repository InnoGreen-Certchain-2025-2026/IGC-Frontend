import { useParams, NavLink, Outlet } from "react-router";

/**
 * Layout for organization certificates section. Uses internal tabs
 * to switch between list, creation form and verification tools.
 */
export default function OrgCertificatesPage() {
  const { orgCode } = useParams<{ orgCode: string }>();

  const TABS = [
    { to: `/org/${orgCode}/certificates`, label: "Tổng quan", end: true },
    {
      to: `/org/${orgCode}/certificates/create-draft`,
      label: "Tạo bản nháp",
    },
    {
      to: `/org/${orgCode}/certificates/verify`,
      label: "Xác thực",
    },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chứng chỉ</h2>
          <p className="text-gray-500">
            Quản lý chứng chỉ và bằng cấp do tổ chức cấp phát.
          </p>
        </div>
      </header>

      {/* internal tabs */}
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

      {/* outlet for subpages */}
      <Outlet />
    </div>
  );
}
