import { useEffect, useState } from "react";
import { Plus, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { templateSchemaService } from "@/services/templateSchemaService";

interface TemplateSelectorProps {
  orgId: number;
  activeTemplateId?: string;
  templateName: string;
  onSelectTemplate: (templateId: string, name: string) => void;
  onCreateNew: () => void;
}

interface TemplateInfo {
  id: string;
  name: string;
}

export default function TemplateSelector({
  orgId,
  activeTemplateId,
  templateName,
  onSelectTemplate,
  onCreateNew,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const list = await templateSchemaService.getAllTemplates(orgId);
        setTemplates(list.map((t) => ({ id: t.id, name: t.name })));
      } catch (error) {
        console.error("Lỗi khi tải danh sách template:", error);
        toast.error("Không thể tải danh sách template");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-600">
        <Loader2 className="size-4 animate-spin" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select
        value={activeTemplateId ?? ""}
        onValueChange={(templateId) => {
          const template = templates.find((t) => t.id === templateId);
          if (template) {
            onSelectTemplate(templateId, template.name);
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-[260px]">
          <SelectValue placeholder="Chọn template đã có" />
        </SelectTrigger>
        <SelectContent>
          {templates.length === 0 ? (
            <div className="px-2 py-3 text-sm text-gray-500">
              Chưa có template nào
            </div>
          ) : (
            templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <span className="flex items-center gap-2">
                  <FileText className="size-4 text-blue-600" />
                  {template.name}
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={onCreateNew}
      >
        <Plus className="size-4" />
        Tạo template mới
      </Button>

      {activeTemplateId ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <FileText className="size-3.5" />
          {templateName || "Template đang chọn"}
        </div>
      ) : null}
    </div>
  );
}
