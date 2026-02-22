import { Users, ScrollText, ShieldCheck, TrendingUp } from "lucide-react";
import { useAppSelector } from "@/features/hooks";

/**
 * Organization overview page.
 * Displays key stats and quick links for the organization.
 */
export default function OrgOverviewPage() {
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  const stats = [
    {
      label: "Thành viên",
      value: "—",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Chứng chỉ đã cấp",
      value: "—",
      icon: ScrollText,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Vai trò",
      value: "—",
      icon: ShieldCheck,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Hoạt động tháng này",
      value: "—",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-gray-500">
          Xem tổng quan hoạt động của tổ chức {selectedOrg?.name ?? ""}.
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <div
              className={`h-11 w-11 rounded-lg flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for recent activity */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
        <p className="text-sm text-gray-400 italic">
          Chưa có hoạt động nào được ghi nhận.
        </p>
      </div>
    </div>
  );
}
