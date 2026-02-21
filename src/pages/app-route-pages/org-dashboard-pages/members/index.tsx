import { Users } from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";

/**
 * Organization members page.
 * Lists members of the organization with invite capabilities.
 */
export default function OrgMembersPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Thành viên</h2>
          <p className="text-gray-500">
            Quản lý thành viên và lời mời tham gia tổ chức.
          </p>
        </div>
      </header>

      <EmptyState
        icon={Users}
        title="Chưa có thành viên nào"
        description="Mời thành viên vào tổ chức để bắt đầu cộng tác."
        actionLabel="Mời thành viên"
        onAction={() => alert("TODO: Mời thành viên")}
      />
    </div>
  );
}
