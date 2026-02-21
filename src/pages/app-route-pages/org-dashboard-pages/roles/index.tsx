import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";

/**
 * Organization roles & permissions page.
 * Manages roles and their associated permissions within the organization.
 */
export default function OrgRolesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vai trò & Quyền</h2>
          <p className="text-gray-500">
            Thiết lập vai trò và phân quyền cho thành viên trong tổ chức.
          </p>
        </div>
      </header>

      <EmptyState
        icon={ShieldCheck}
        title="Chưa có vai trò nào"
        description="Tạo vai trò để phân quyền cho thành viên trong tổ chức."
        actionLabel="Tạo vai trò"
        onAction={() => alert("TODO: Tạo vai trò")}
      />
    </div>
  );
}
