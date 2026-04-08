import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FileText, Loader2, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { useBatchProgressPolling } from "@/hooks/useBatchProgressPolling";
import type { TemplateResponse } from "@/types/template";

type UploadState = {
  excelFile: File | null;
  signatureImage: File | null;
  userCertificate: File | null;
  certificatePassword: string;
};

const initialState: UploadState = {
  excelFile: null,
  signatureImage: null,
  userCertificate: null,
  certificatePassword: "",
};

function isSpreadsheetFile(file: File | null) {
  if (!file) return false;
  const lowerName = file.name.toLowerCase();
  return lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls");
}

function isSignatureCertificateFile(file: File | null) {
  if (!file) return false;
  const lowerName = file.name.toLowerCase();
  return lowerName.endsWith(".p12") || lowerName.endsWith(".pfx");
}

function isImageFile(file: File | null) {
  if (!file) return false;
  return (
    file.type.startsWith("image/") || /\.(png|jpg|jpeg|webp)$/i.test(file.name)
  );
}

function getFileLabel(file: File | null) {
  return file ? file.name : "Chưa chọn file";
}

export default function TemplateBatchPage() {
  const navigate = useNavigate();
  const { templateId, orgCode } = useParams<{
    templateId: string;
    orgCode: string;
  }>();
  const { orgId } = useOrganizationContext();
  const safeTemplateId = templateId ?? "";
  const safeOrgId = orgId ?? 0;
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [form, setForm] = useState<UploadState>(initialState);
  const [submittedBatchId, setSubmittedBatchId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    progress,
    isLoading: isPolling,
    error: pollingError,
  } = useBatchProgressPolling(submittedBatchId);
  const hasRequiredContext = Boolean(orgId && templateId);

  useEffect(() => {
    if (!hasRequiredContext) {
      return;
    }

    let cancelled = false;

    const loadTemplate = async () => {
      setIsLoadingTemplate(true);
      try {
        const response = await templateApi.getTemplate(
          safeTemplateId,
          safeOrgId,
        );
        if (!cancelled) {
          setTemplate(response);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải template";
        if (!cancelled) {
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTemplate(false);
        }
      }
    };

    loadTemplate();

    return () => {
      cancelled = true;
    };
  }, [hasRequiredContext, safeOrgId, safeTemplateId]);

  const validationError = useMemo(() => {
    if (!form.excelFile || !isSpreadsheetFile(form.excelFile)) {
      return "File Excel phải là .xlsx hoặc .xls";
    }

    if (!form.signatureImage || !isImageFile(form.signatureImage)) {
      return "Vui lòng chọn ảnh chữ ký hợp lệ";
    }

    if (
      !form.userCertificate ||
      !isSignatureCertificateFile(form.userCertificate)
    ) {
      return "File chứng chỉ số phải là .p12 hoặc .pfx";
    }

    if (!form.certificatePassword.trim()) {
      return "Mật khẩu chữ ký số không được để trống";
    }

    return null;
  }, [form]);

  const handleChange = (
    key: keyof UploadState,
    value: string | File | null,
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!safeTemplateId || !safeOrgId) {
      toast.error("Thiếu template hoặc tổ chức đang chọn");
      return;
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await templateApi.bulkCreateCertificates(
        safeTemplateId,
        {
          orgId: safeOrgId,
          excelFile: form.excelFile!,
          signatureImage: form.signatureImage!,
          userCertificate: form.userCertificate!,
          certificatePassword: form.certificatePassword,
        },
      );

      setSubmittedBatchId(response.data.batchId);
      toast.success(response.data.message || "Đã khởi tạo batch");
    } catch (submitRequestError) {
      const message =
        submitRequestError instanceof Error
          ? submitRequestError.message
          : "Không thể tạo batch";
      setSubmitError(message);
      toast.error(message);
    }
  };

  const handleDownloadExcelTemplate = async () => {
    if (!safeTemplateId || !safeOrgId) return;

    try {
      const file = await templateApi.getExcelTemplateDownload(
        safeTemplateId,
        safeOrgId,
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

  const canSubmit = Boolean(templateId && orgId);

  if (!hasRequiredContext) {
    return (
      <Card className="border-dashed p-6 text-sm text-slate-600">
        Không thể mở màn tạo hàng loạt do thiếu thông tin tổ chức hoặc template.
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-emerald-50 p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Batch certificates</Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tạo chứng chỉ hàng loạt
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Upload Excel, chữ ký tay và chứng chỉ số để tạo batch theo template.
            Tiến độ được cập nhật realtime bằng polling mỗi 1-2 giây.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDownloadExcelTemplate}>
            <FileText className="size-4" />
            Tải Excel mẫu
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigate(
                `/org/${orgCode}/certificates/templates/${safeTemplateId}`,
              )
            }
          >
            <RefreshCw className="size-4" />
            Quay về chi tiết template
          </Button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50/80 pb-4">
            <CardTitle className="text-base">Thông tin batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
                {isLoadingTemplate ? (
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Loader2 className="size-4 animate-spin" /> Đang tải
                    template...
                  </span>
                ) : (
                  <>
                    <div className="font-medium text-slate-900">
                      {template?.name ?? "Template đang chọn"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {template?.fields.length ?? 0} fields
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="excelFile">File Excel</Label>
                <Input
                  id="excelFile"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(event) =>
                    handleChange("excelFile", event.target.files?.[0] ?? null)
                  }
                />
                <p className="text-xs text-slate-500">
                  {getFileLabel(form.excelFile)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatureImage">Ảnh chữ ký</Label>
                <Input
                  id="signatureImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleChange(
                      "signatureImage",
                      event.target.files?.[0] ?? null,
                    )
                  }
                />
                <p className="text-xs text-slate-500">
                  {getFileLabel(form.signatureImage)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userCertificate">Chứng chỉ số</Label>
                <Input
                  id="userCertificate"
                  type="file"
                  accept=".p12,.pfx"
                  onChange={(event) =>
                    handleChange(
                      "userCertificate",
                      event.target.files?.[0] ?? null,
                    )
                  }
                />
                <p className="text-xs text-slate-500">
                  {getFileLabel(form.userCertificate)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificatePassword">Mật khẩu chứng chỉ</Label>
                <Input
                  id="certificatePassword"
                  type="password"
                  value={form.certificatePassword}
                  onChange={(event) =>
                    handleChange("certificatePassword", event.target.value)
                  }
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                <Upload className="size-4" />
                Tạo batch
              </Button>
              {validationError ? (
                <p className="self-center text-sm text-rose-600">
                  {validationError}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {submitError}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50/80 pb-4">
            <CardTitle className="text-base">Tiến độ realtime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {!submittedBatchId ? (
              <div className="rounded-xl border border-dashed p-6 text-sm text-slate-500">
                Chưa có batch nào. Sau khi bấm Tạo batch, tiến độ sẽ được theo
                dõi tự động.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Batch {submittedBatchId.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {progress?.currentMessage ?? "Đang theo dõi tiến độ..."}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {progress?.status ?? "PENDING"}
                  </Badge>
                </div>

                <Progress value={progress?.progressPercent ?? 0} />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Thành công</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-600">
                      {progress?.successCount ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Thất bại</p>
                    <p className="mt-1 text-lg font-semibold text-rose-600">
                      {progress?.failureCount ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Đã xử lý</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {progress?.processedRows ?? 0}/{progress?.totalRows ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Polling</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {isPolling ? "Đang chạy" : "Đang chờ"}
                    </p>
                  </div>
                </div>

                {pollingError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    {pollingError}
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/80 pb-4">
          <CardTitle className="text-base">Lỗi theo từng dòng</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-112">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(progress?.errors ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      Chưa có lỗi được ghi nhận.
                    </TableCell>
                  </TableRow>
                ) : (
                  progress?.errors.map((errorRow) => (
                    <TableRow
                      key={`${errorRow.rowNumber}-${errorRow.certificateId ?? "empty"}`}
                    >
                      <TableCell>{errorRow.rowNumber}</TableCell>
                      <TableCell>{errorRow.certificateId ?? "-"}</TableCell>
                      <TableCell className="whitespace-normal text-rose-600">
                        {errorRow.error}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
