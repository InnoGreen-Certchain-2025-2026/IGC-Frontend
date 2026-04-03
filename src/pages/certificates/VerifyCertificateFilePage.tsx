import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useVerifyCertificateById,
  useVerifyCertificateByPdfFile,
} from "@/hooks/useCertificates";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import {
  ApiBusinessError,
  type VerifyCertificateFileResponse,
} from "@/types/certificate";

export default function VerifyCertificateFilePage() {
  const navigate = useNavigate();
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [certificateId, setCertificateId] = useState("");
  const verifyByFileMutation = useVerifyCertificateByPdfFile();
  const verifyByIdMutation = useVerifyCertificateById();
  const [result, setResult] = useState<VerifyCertificateFileResponse | null>(
    null,
  );

  const fileName = useMemo(() => pdfFile?.name ?? "", [pdfFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setPdfFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setPdfFile(null);
      toast.error(text.validation.pdfFileInvalid);
      return;
    }

    setPdfFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pdfFile) {
      toast.error(text.validation.pdfFileInvalid);
      return;
    }

    try {
      const payload = await verifyByFileMutation.mutateAsync(pdfFile);
      setResult(payload);
      toast.success(text.notifications.verifyFileSuccess);
    } catch (error) {
      if (error instanceof ApiBusinessError) {
        toast.error(error.message);
        return;
      }

      toast.error(text.notifications.unexpectedError);
    }
  };

  const handleVerifyById = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedId = certificateId.trim();
    if (!normalizedId) {
      toast.error("Vui lòng nhập mã certificateId.");
      return;
    }

    try {
      const payload = await verifyByIdMutation.mutateAsync(normalizedId);
      setResult(payload);
      toast.success("Xác thực theo mã chứng chỉ thành công.");
    } catch (error) {
      if (error instanceof ApiBusinessError) {
        toast.error(error.message);
        return;
      }

      toast.error(text.notifications.unexpectedError);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-semibold">
          Xác thực chứng chỉ bằng tệp PDF
        </h1>
        <p className="text-muted-foreground text-sm">
          Tải đúng 1 tệp PDF và hệ thống sẽ kiểm tra tính hợp lệ của chứng chỉ.
        </p>
      </header>

      <Card className="p-5">
        <form className="space-y-3 border-b pb-5" onSubmit={handleVerifyById}>
          <Label htmlFor="certificateId">Xác thực theo certificateId</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="certificateId"
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Nhập mã certificateId"
            />
            <Button
              type="submit"
              disabled={verifyByIdMutation.isPending || !certificateId.trim()}
            >
              {verifyByIdMutation.isPending
                ? "Đang xác thực..."
                : text.actions.verify}
            </Button>
          </div>
        </form>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Label htmlFor="pdfFile">Tệp PDF chứng chỉ</Label>
          <Input
            id="pdfFile"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
          />

          {fileName ? (
            <p className="text-muted-foreground text-sm">Đã chọn: {fileName}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={!pdfFile || verifyByFileMutation.isPending}
            >
              {verifyByFileMutation.isPending
                ? "Đang xác thực..."
                : text.actions.verify}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/claim")}
            >
              Quay lại tra cứu mã nhận
            </Button>
          </div>
        </form>
      </Card>

      {result ? (
        <Card
          className={
            result.valid
              ? "space-y-3 border-emerald-200 bg-emerald-50 p-5"
              : "space-y-3 border-red-200 bg-red-50 p-5"
          }
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <FileCheck2 className="size-5 text-emerald-700" />
            ) : (
              <AlertTriangle className="size-5 text-red-700" />
            )}
            <h2 className="text-lg font-semibold">
              {result.valid ? "Chứng chỉ hợp lệ" : "Chứng chỉ không hợp lệ"}
            </h2>
          </div>

          {!result.valid ? (
            <p className="text-sm text-red-700">{result.message}</p>
          ) : null}

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p>
              <span className="font-medium">exists:</span>{" "}
              {String(result.exists)}
            </p>
            <p>
              <span className="font-medium">valid:</span> {String(result.valid)}
            </p>
            <p>
              <span className="font-medium">certificateId:</span>{" "}
              {result.certificateId || "-"}
            </p>
            <p>
              <span className="font-medium">studentName:</span>{" "}
              {result.studentName || "-"}
            </p>
            <p>
              <span className="font-medium">issuer:</span>{" "}
              {result.issuer || "-"}
            </p>
            <p>
              <span className="font-medium">issueTimestamp:</span>{" "}
              {result.issueTimestamp || "-"}
            </p>
            <p className="md:col-span-2">
              <span className="font-medium">documentHash:</span>{" "}
              {result.documentHash || "-"}
            </p>
            <p className="md:col-span-2">
              <span className="font-medium">message:</span>{" "}
              {result.message || "-"}
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
