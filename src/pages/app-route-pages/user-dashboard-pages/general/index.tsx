import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, BadgeCheck, Clock, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  claimCertificateApi,
  getMyCertificatesApi,
} from "@/services/certificateService";
import type { CertificateResponse } from "@/types/certificate/CertificateResponse";

/**
 * "Chung" (General/Overview) page.
 * Shows a high-level summary of the user's certificates and a claim box.
 */
export default function GeneralPage() {
  const [certs, setCerts] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimCode, setClaimCode] = useState("");

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await getMyCertificatesApi();
      if (res.data) setCerts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải bằng cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleClaim = async () => {
    if (!claimCode) return;
    try {
      const res = await claimCertificateApi(claimCode);
      toast.success("Đã thêm chứng chỉ: " + res.data.certificateId);
      loadCertificates();
      setClaimCode("");
    } catch (err) {
      console.error(err);
      toast.error("Không thể claim chứng chỉ");
    }
  };

  // compute stats
  const total = certs.length;
  const valid = certs.filter((c) => c.isValid).length;
  const invalid = total - valid;

  const stats = [
    {
      label: "Tổng bằng cấp",
      value: total,
      icon: ScrollText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Hợp lệ",
      value: valid,
      icon: BadgeCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Không hợp lệ",
      value: invalid,
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

      <div className="flex items-center mb-6 space-x-2">
        <Input
          placeholder="Nhập mã claim"
          value={claimCode}
          onChange={(e) => setClaimCode(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleClaim} disabled={!claimCode || loading}>
          <FileText className="w-4 h-4 mr-1" />
          {loading ? "Đang xử lý" : "Claim"}
        </Button>
      </div>

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
