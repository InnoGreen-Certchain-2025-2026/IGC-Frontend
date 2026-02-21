import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";

/**
 * Organization certificates page.
 * Manages certificates issued by the organization.
 */
export default function OrgCertificatesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chứng chỉ</h2>
          <p className="text-gray-500">
            Quản lý chứng chỉ và bằng cấp do tổ chức cấp phát.
          </p>
        </div>
      </header>

      <EmptyState
        icon={ScrollText}
        title="Chưa có chứng chỉ nào"
        description="Tổ chức chưa cấp chứng chỉ nào. Bắt đầu tạo chứng chỉ mới."
        actionLabel="Tạo chứng chỉ"
        onAction={() => alert("TODO: Tạo chứng chỉ")}
      />
    </div>
  );
}
