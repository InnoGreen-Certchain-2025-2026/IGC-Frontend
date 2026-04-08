import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowRight,
  Download,
  FileText,
  Grid2x2,
  Loader2,
  Plus,
  Search,
  Trash2,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { templateApi } from "@/services/templateApi";
import { triggerBlobDownload } from "@/lib/download";
import type { TemplateResponse } from "@/types/template";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function TemplateCard({
  template,
  onView,
  onEdit,
  onDownload,
  onBatch,
  onDelete,
}: {
  template: TemplateResponse;
  onView: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onBatch: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Template</Badge>
          <Badge variant="outline">{template.fields.length} fields</Badge>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {template.name}
        </h3>
        <p className="break-all text-xs text-slate-500">
          {template.pdfStorageKey ?? template.pdfUrl ?? "No pdf key"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <span>Created: {formatDate(template.createdAt)}</span>
        <span>Updated: {formatDate(template.updatedAt)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onView}>
          <ArrowRight className="size-4" />
          Xem
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Sửa
        </Button>
        <Button size="sm" variant="outline" onClick={onDownload}>
          <Download className="size-4" />
          Excel mẫu
        </Button>
        <Button size="sm" variant="outline" onClick={onBatch}>
          <Workflow className="size-4" />
          Tạo hàng loạt
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Xóa
        </Button>
      </div>
    </Card>
  );
}

export default function TemplateListPage() {
  const navigate = useNavigate();
  const { orgCode } = useParams<{ orgCode: string }>();
  const { orgId } = useOrganizationContext();
  const [searchText, setSearchText] = useState("");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TemplateResponse | null>(
    null,
  );

  useEffect(() => {
    if (!orgId) return;

    let cancelled = false;

    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await templateApi.getTemplates(
          orgId,
          searchText.trim(),
        );
        if (!cancelled) {
          setTemplates(response.data);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải danh sách template";
        if (!cancelled) {
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [orgId, searchText]);

  const handleDownloadExcelTemplate = async (templateId: string) => {
    if (!orgId) return;

    try {
      const file = await templateApi.getExcelTemplateDownload(
        templateId,
        orgId,
      );
      triggerBlobDownload(file.blob, file.filename);
      toast.success("Đã tải file Excel mẫu");
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Không thể tải Excel mẫu";
      toast.error(message);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTarget || !orgId) return;

    try {
      await templateApi.deleteTemplate(deleteTarget.id, orgId);
      setTemplates((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      toast.success("Đã xóa template");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xóa template";
      toast.error(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredTemplates = useMemo(() => templates, [templates]);

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              Template
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Quản lý template
            </h1>
            <p className="max-w-3xl text-sm text-slate-600">
              Tìm template theo tên, xem chi tiết PDF, tải Excel mẫu, sửa schema
              hoặc tạo batch chứng chỉ từ cùng một màn hình.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate(`/org/${orgCode}/certificates/templates/new`)
            }
          >
            <Plus className="size-4" />
            Tạo template mới
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm theo tên template..."
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="gap-1 w-fit">
            <Grid2x2 className="size-3.5" />
            {templates.length} template
          </Badge>
        </div>
      </header>

      {isLoading ? (
        <Card className="flex items-center gap-2 p-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="size-4 animate-spin" />
          Đang tải template...
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card className="border-dashed p-8 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="rounded-full bg-sky-50 p-3 text-sky-700">
              <FileText className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Chưa có template nào
            </h2>
            <p className="text-sm text-slate-600">
              Tạo template đầu tiên để upload PDF, chọn field và dùng cho batch
              chứng chỉ.
            </p>
            <Button
              onClick={() =>
                navigate(`/org/${orgCode}/certificates/templates/new`)
              }
            >
              <Plus className="size-4" />
              Tạo template mới
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium text-slate-900">
                      {template.name}
                    </TableCell>
                    <TableCell>{template.fields.length}</TableCell>
                    <TableCell>{formatDate(template.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/org/${orgCode}/certificates/template-editor/${template.id}`,
                            )
                          }
                        >
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/org/${orgCode}/certificates/template-editor/${template.id}`,
                            )
                          }
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDownloadExcelTemplate(template.id)
                          }
                        >
                          Tải mẫu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/org/${orgCode}/certificates/templates/${template.id}/bulk`,
                            )
                          }
                        >
                          Tạo hàng loạt
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(template)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onView={() =>
                  navigate(
                    `/org/${orgCode}/certificates/template-editor/${template.id}`,
                  )
                }
                onEdit={() =>
                  navigate(
                    `/org/${orgCode}/certificates/template-editor/${template.id}`,
                  )
                }
                onDownload={() => handleDownloadExcelTemplate(template.id)}
                onBatch={() =>
                  navigate(
                    `/org/${orgCode}/certificates/templates/${template.id}/bulk`,
                  )
                }
                onDelete={() => setDeleteTarget(template)}
              />
            ))}
          </div>
        </>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa template?</AlertDialogTitle>
            <AlertDialogDescription>
              Template {deleteTarget?.name ?? "này"} sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
