import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Loader2, Plus, RefreshCw, Save, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { useTemplateEditor } from "@/hooks/useTemplateEditor";
import PdfCanvasViewer from "@/components/template/PdfCanvasViewer";
import FieldSidebar from "@/components/template/FieldSidebar";
import { getUserBriefOrganizationsApi } from "@/services/organizationService";

function getSaveStatusLabel(
  saveLoading: boolean,
  lastSavedAt: string | null,
  errorMessage: string | null,
) {
  if (saveLoading) return "Đang lưu...";
  if (errorMessage) return "Lỗi";
  if (lastSavedAt) return "Đã lưu";
  return "Chưa lưu";
}

export default function TemplateEditorPage() {
  const navigate = useNavigate();
  const { templateId, orgCode } = useParams<{
    templateId: string;
    orgCode: string;
  }>();
  const { orgId, organization } = useOrganizationContext();
  const [resolvedOrgId, setResolvedOrgId] = useState<number | null>(orgId);
  const [resolvingOrg, setResolvingOrg] = useState(false);

  useEffect(() => {
    if (orgId) {
      setResolvedOrgId(orgId);
      return;
    }

    if (!orgCode) {
      setResolvedOrgId(null);
      return;
    }

    let cancelled = false;

    const resolveOrg = async () => {
      setResolvingOrg(true);
      try {
        const response = await getUserBriefOrganizationsApi();
        if (cancelled) return;

        const matchedOrganization = response.data.find(
          (item) => item.code === orgCode,
        );

        setResolvedOrgId(matchedOrganization?.id ?? null);
      } catch {
        if (!cancelled) {
          setResolvedOrgId(null);
        }
      } finally {
        if (!cancelled) {
          setResolvingOrg(false);
        }
      }
    };

    resolveOrg();

    return () => {
      cancelled = true;
    };
  }, [orgCode, orgId]);

  const {
    hasContext,
    template,
    fields,
    selectedFieldId,
    pdfBlobUrl,
    metadataLoading,
    pdfLoading,
    saveLoading,
    error,
    lastSavedAt,
    setSelectedFieldId,
    updateField,
    removeField,
    addField,
    saveSchema,
    reloadAll,
  } = useTemplateEditor(templateId ?? undefined, resolvedOrgId ?? undefined);

  const saveStatus = useMemo(
    () => getSaveStatusLabel(saveLoading, lastSavedAt, error),
    [error, lastSavedAt, saveLoading],
  );

  const handleSaveAndBack = async () => {
    const isSaved = await saveSchema();
    if (!isSaved) return;

    navigate(`/org/${orgCode}/certificates/templates`, {
      replace: true,
      state: { refreshedAt: Date.now() },
    });
  };

  if (!templateId) {
    return <Navigate to={`/org/${orgCode}/certificates/templates`} replace />;
  }

  if (resolvingOrg && !resolvedOrgId) {
    return (
      <Card className="flex items-center gap-2 p-6 text-sm text-slate-600">
        <Loader2 className="size-4 animate-spin" />
        Đang đồng bộ thông tin tổ chức...
      </Card>
    );
  }

  if (!hasContext) {
    return (
      <Card className="border-dashed p-6 text-sm text-slate-600">
        Không thể mở Template Editor vì thiếu thông tin tổ chức hoặc template.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-[#214e41] via-[#336b59] to-[#1a3a32] p-5 shadow-md text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
              Tạo template
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Template Editor
            </h1>
            <p className="text-sm text-slate-100">
              {template?.name ?? "Đang tải template..."}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge className="bg-[#edf4f0] text-[#214e41]">
                orgId: {resolvedOrgId}
              </Badge>
              <Badge className="bg-white/90 text-[#214e41]">
                templateId: {templateId}
              </Badge>
              <Badge className="bg-white/90 text-[#214e41]">{saveStatus}</Badge>
              {organization?.code ? (
                <Badge className="bg-white/90 text-[#214e41]">
                  orgCode: {organization.code}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="keep-original-button-color border-[#214e41] bg-[#214e41] text-white hover:bg-[#183930]"
              onClick={() => addField()}
              disabled={metadataLoading || pdfLoading}
            >
              <Plus className="size-4" />
              Thêm field
            </Button>
            <Button
              type="button"
              variant="outline"
              className="keep-original-button-color border-[#0ea5e9] bg-[#0ea5e9] text-white hover:bg-[#0284c7]"
              onClick={reloadAll}
              disabled={metadataLoading || pdfLoading}
            >
              <RefreshCw className="size-4" />
              Tải lại
            </Button>
            <Button
              type="button"
              className="keep-original-button-color border border-[#f2ce3c] bg-[#f2ce3c] text-[#214e41] hover:bg-[#e0bc1f]"
              onClick={handleSaveAndBack}
              disabled={saveLoading || metadataLoading}
            >
              {saveLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Lưu schema
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <TriangleAlert className="mt-0.5 size-4" />
            <span>{error}</span>
          </div>
        ) : null}
      </header>

      {metadataLoading ? (
        <Card className="flex items-center gap-2 p-5 text-sm text-slate-600">
          <Loader2 className="size-4 animate-spin" />
          Đang tải metadata template...
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_360px]">
          <PdfCanvasViewer
            pdfUrl={pdfBlobUrl}
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onUpdateField={updateField}
            onDeleteField={removeField}
            pdfLoading={pdfLoading}
            pdfError={error}
            onRetryPdf={reloadAll}
          />

          <FieldSidebar
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onDeleteField={removeField}
            onUpdateField={updateField}
            onCreateField={({ name, type }) => addField({ name, type })}
          />
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-2 text-xs text-slate-600">
        <span>
          {lastSavedAt
            ? `Lần lưu gần nhất: ${new Date(lastSavedAt).toLocaleString("vi-VN")}`
            : "Chưa lưu thay đổi"}
        </span>
        <button
          type="button"
          className="font-medium text-[#214e41] underline-offset-2 hover:underline"
          onClick={() => navigate(`/org/${orgCode}/certificates/templates`)}
        >
          Quay lại danh sách template
        </button>
      </div>
    </div>
  );
}
