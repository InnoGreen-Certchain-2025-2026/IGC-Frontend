import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MailOpen } from "lucide-react";
import { EmptyState } from "@/components/custom/empty-state/EmptyState";

/**
 * Organizations management page.
 * Features tabs for "My Organizations" and "Invitations".
 */
export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tổ chức</h2>
          <p className="text-gray-500">Quản lý các tổ chức của bạn và các lời mời tham gia.</p>
        </div>
      </header>

      <Tabs defaultValue="my-organizations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="my-organizations">Các tổ chức của tôi</TabsTrigger>
          <TabsTrigger value="invitations">Lời mời vào tổ chức</TabsTrigger>
        </TabsList>

        <TabsContent value="my-organizations" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Danh sách tổ chức</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo tổ chức
            </Button>
          </div>
          
          <EmptyState
            icon={Building2}
            title="Chưa có tổ chức nào"
            description="Bạn chưa tham gia hoặc sở hữu tổ chức nào. Hãy tạo một tổ chức mới để bắt đầu."
            actionLabel="Tạo tổ chức ngay"
            onAction={() => console.log("Create org")}
          />
        </TabsContent>

        <TabsContent value="invitations">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Lời mời đang chờ</h3>
          </div>
          
          <EmptyState
            icon={MailOpen}
            title="Không có lời mời"
            description="Hiện tại bạn không có lời mời nào vào các tổ chức khác."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
