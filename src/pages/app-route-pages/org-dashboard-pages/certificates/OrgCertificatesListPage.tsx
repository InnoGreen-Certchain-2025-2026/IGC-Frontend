import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/features/hooks";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CertificateResponse } from "@/types/certificate/CertificateResponse";
import {
  getCertificatesByOrganizationApi,
  revokeCertificateApi,
  reactivateCertificateApi,
} from "@/services/certificateService";
import { toast } from "sonner";

export default function OrgCertificatesListPage() {
  const navigate = useNavigate();
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  const [certs, setCerts] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = useCallback(async () => {
    if (!selectedOrg?.id) return;
    setLoading(true);
    try {
      const res = await getCertificatesByOrganizationApi(selectedOrg.id);
      if (res.data) {
        setCerts(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách chứng chỉ");
    } finally {
      setLoading(false);
    }
  }, [selectedOrg?.id]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  if (!selectedOrg?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-gray-500">Không có tổ chức được chọn.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const handleRevoke = async (id: string) => {
    try {
      await revokeCertificateApi(id);
      toast.success("Chứng chỉ đã được thu hồi");
      fetchCertificates();
    } catch (err) {
      console.error(err);
      toast.error("Không thể thu hồi chứng chỉ");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await reactivateCertificateApi(id);
      toast.success("Chứng chỉ đã được kích hoạt lại");
      fetchCertificates();
    } catch (err) {
      console.error(err);
      toast.error("Không thể kích hoạt lại chứng chỉ");
    }
  };

  if (certs.length === 0) {
    return (
      <EmptyState
        icon={ScrollText}
        title="Chưa có chứng chỉ nào"
        description="Tổ chức chưa cấp chứng chỉ nào. Bắt đầu tạo chứng chỉ mới."
        actionLabel="Tạo chứng chỉ"
        onAction={() => navigate("create")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate("create")}>Tạo chứng chỉ</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sinh viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certs.map((c) => (
              <tr key={c.certificateId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.certificateId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.studentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.issueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {c.isValid ? (
                    <span className="text-green-600">Hợp lệ</span>
                  ) : (
                    <span className="text-red-600">Đã thu hồi</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {c.isValid ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRevoke(c.certificateId)}
                    >
                      Thu hồi
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleReactivate(c.certificateId)}
                    >
                      Kích hoạt lại
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
