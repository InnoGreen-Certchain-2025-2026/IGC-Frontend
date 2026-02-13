import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, BadgeCheck, Clock } from "lucide-react";

/**
 * "Chung" (General/Overview) page.
 * Shows a high-level summary of the user's certificates.
 */
export default function GeneralPage() {
  const stats = [
    {
      label: "Tổng bằng cấp",
      value: 2,
      icon: ScrollText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Đã xác minh",
      value: 1,
      icon: BadgeCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Đang chờ",
      value: 1,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <p className="text-gray-500 mb-6">
        Chào mừng bạn quay lại! Dưới đây là tổng quan về bằng cấp của bạn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {s.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
