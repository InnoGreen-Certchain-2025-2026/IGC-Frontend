import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard() {
  const dummyCerts = [
    { id: "CertChain-10023", name: "Nền tảng Blockchain", date: "2025-10-12", status: "Đã xác minh" },
    { id: "CertChain-20045", name: "React Chuyên nghiệp", date: "2025-12-05", status: "Đang chờ" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Chứng chỉ của tôi</h1>
        <p className="text-gray-500">Quản lý và chia sẻ thông tin chứng chỉ đã xác minh của bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyCerts.map((cert) => (
          <Card key={cert.id} className="hover:border-blue-500 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{cert.name}</CardTitle>
                <Badge variant={cert.status === "Đã xác minh" ? "default" : "secondary"} className={cert.status === "Đã xác minh" ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                  {cert.status}
                </Badge>
              </div>
              <CardDescription>{cert.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Ngày cấp: {cert.date}</div>
              <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">Xem giao dịch &rarr;</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
