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
          <Badge className="bg-[#214e41] text-white">Template</Badge>
          <Badge variant="outline" className="border-[#4f9b5a] text-[#214e41]">
            {template.fields.length} fields
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-[#214e41]">
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
        <Button
          size="sm"
          className="keep-original-button-color bg-[#214e41] hover:bg-[#183930] text-white border border-[#214e41]"
          onClick={onView}
        >
          <ArrowRight className="size-4" />
          Xem
        </Button>
        <Button
          size="sm"
          className="keep-original-button-color bg-[#4f9b5a] hover:bg-[#3d8047] text-white border border-[#4f9b5a]"
          onClick={onEdit}
        >
          Sửa{" "}
        </Button>
        <Button
          size="sm"
          className="keep-original-button-color bg-[#0ea5e9] hover:bg-[#0284c7] text-white border border-[#0ea5e9]"
          onClick={onDownload}
        >
          <Download className="size-4" />
          Excel mẫu
        </Button>
        <Button
          size="sm"
          className="keep-original-button-color bg-[#f2ce3c] hover:bg-[#e0bc1f] text-[#214e41] border border-[#f2ce3c] font-medium"
          onClick={onBatch}
        >
          <Workflow className="size-4" />
          Tạo hàng loạt
        </Button>
        <Button
          size="sm"
          className="keep-original-button-color bg-red-600 hover:bg-red-700 text-white border border-red-600"
          onClick={onDelete}
        >
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
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-[#214e41] via-[#336b59] to-[#1a3a32] p-5 shadow-md text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
              Template
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Quản lý template
            </h1>
            <p className="max-w-3xl text-sm text-slate-100">
              Tìm template theo tên, xem PDF, tải Excel mẫu, sửa schema hoặc tạo
              hàng loạt chứng chỉ từ cùng một màn hình.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate(`/org/${orgCode}/certificates/templates/new`)
            }
            className="keep-original-button-color bg-[#f2ce3c] hover:bg-[#e0bc1f] text-[#214e41] font-semibold border border-[#f2ce3c] white-space-nowrap w-fit"
          >
            <Plus className="size-4" />
            Tạo template mới
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex flex-1 items-center h-11 px-3 md:px-4 bg-white border-2 border-[#183930] rounded-full shadow-md transition-all duration-300 hover:border-[#4f9b5a]">
            <Search className="size-4 text-[#214e41] shrink-0" />
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm theo tên template..."
              className="grow bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-900 px-2 md:px-3 placeholder:text-slate-400 h-full font-medium min-w-0"
            />
          </div>
          <Badge className="gap-1 w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
            <Grid2x2 className="size-3.5" />
            {templates.length} template
          </Badge>
        </div>
      </header>

      {isLoading ? (
        <Card className="flex items-center gap-2 p-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="size-4 animate-spin text-[#214e41]" />
          Đang tải template...
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card className="border-dashed p-8 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="rounded-full bg-[#214e41]/10 p-3 text-[#214e41]">
              <FileText className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-[#214e41]">
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
              className="keep-original-button-color bg-[#214e41] hover:bg-[#183930] text-white font-semibold"
            >
              <Plus className="size-4" />
              Tạo template mới
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#214e41] w-1/4">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#214e41] w-1/6">
                    Fields
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#214e41] w-1/4">
                    Ngày cập nhật
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#214e41] w-1/3">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr
                    key={template.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 w-1/4">
                      {template.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 w-1/6">
                      {template.fields.length}
                    </td>
                    <td className="px-6 py-4 text-slate-600 w-1/4">
                      {formatDate(template.updatedAt)}
                    </td>
                    <td className="px-6 py-4 w-1/3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="keep-original-button-color bg-[#214e41] hover:bg-[#183930] text-white border border-[#214e41] text-xs"
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
                          className="keep-original-button-color bg-[#4f9b5a] hover:bg-[#3d8047] text-white border border-[#4f9b5a] text-xs"
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
                          className="keep-original-button-color bg-[#0ea5e9] hover:bg-[#0284c7] text-white border border-[#0ea5e9] text-xs"
                          onClick={() =>
                            handleDownloadExcelTemplate(template.id)
                          }
                        >
                          Tải mẫu
                        </Button>
                        <Button
                          size="sm"
                          className="keep-original-button-color bg-[#f2ce3c] hover:bg-[#e0bc1f] text-[#214e41] border border-[#f2ce3c] text-xs font-medium"
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
                          className="keep-original-button-color bg-red-600 hover:bg-red-700 text-white border border-red-600 text-xs"
                          onClick={() => setDeleteTarget(template)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <AlertDialogCancel className="keep-original-button-color border border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className="keep-original-button-color bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteTemplate}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
