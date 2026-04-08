import { useParams } from "react-router";
import TemplateEditor from "@/components/template-editor";
import { Card } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

export default function TemplateCreatePage() {
  const { orgCode: routeOrgCode } = useParams<{ orgCode: string }>();
  const { orgId, orgCode } = useOrganizationContext();

  return orgId ? (
    <TemplateEditor orgId={orgId} />
  ) : (
    <Card className="border-dashed p-6 text-sm text-muted-foreground">
      Không tìm thấy tổ chức đang chọn. Vui lòng chọn lại tổ chức từ{" "}
      {orgCode ?? routeOrgCode ?? "dashboard"}.
    </Card>
  );
}
