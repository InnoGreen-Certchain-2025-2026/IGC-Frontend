import { useParams } from "react-router";
import { Settings } from "lucide-react";

/**
 * Organization settings page.
 * Allows editing organization details and configuration.
 */
export default function OrgSettingsPage() {
  const { orgId } = useParams<{ orgId: string }>();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-gray-500">
          Quản lý thông tin và cấu hình cho tổ chức #{orgId}.
        </p>
      </header>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Thông tin tổ chức</h3>
            <p className="text-sm text-gray-500">
              Chỉnh sửa thông tin cơ bản của tổ chức.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-400 italic">
          Tính năng này đang được phát triển.
        </p>
      </div>
    </div>
  );
}
