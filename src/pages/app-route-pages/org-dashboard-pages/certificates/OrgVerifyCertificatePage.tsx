import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertTriangle, FileCheck2, FileText } from "lucide-react";
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

export default function OrgVerifyCertificatePage() {
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const [file, setFile] = useState<File | null>(null);
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<VerifyCertificateFileResponse | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const verifyByFileMutation = useVerifyCertificateByPdfFile();
  const verifyByIdMutation = useVerifyCertificateById();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;

    if (!nextFile) {
      setFile(null);
      return;
    }

    const isPdf =
      nextFile.type === "application/pdf" ||
      nextFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setResult(null);
      toast.error(text.validation.pdfFileInvalid);
      return;
    }

    setFile(nextFile);
  };

  const handleFileVerify = async () => {
    if (!file) return;

    try {
      const payload = await verifyByFileMutation.mutateAsync(file);
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
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-lg font-semibold">
          Xác thực chứng chỉ bằng tệp PDF
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Có thể xác thực theo certificateId hoặc tải lên 1 tệp PDF để kiểm tra.
        </p>
      </Card>

      <Card className="p-5">
        <form className="space-y-3" onSubmit={handleVerifyById}>
          <Label htmlFor="org-certificateId">Xác thực theo certificateId</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="org-certificateId"
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
      </Card>

      <div
        className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
      >
        {file ? (
          <>
            <FileText className="w-12 h-12 text-blue-500" />
            <p className="mt-2 text-gray-800 font-medium">{file.name}</p>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setResult(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              &times;
            </button>
          </>
        ) : (
          <>
            <FileText className="w-12 h-12 text-gray-400" />
            <p className="mt-2 text-gray-600">
              Kéo thả file PDF ở đây hoặc nhấp để chọn
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex justify-center">
        <Button
          disabled={verifyByFileMutation.isPending || !file}
          onClick={handleFileVerify}
          className="mt-2"
        >
          {verifyByFileMutation.isPending
            ? "Đang xác thực..."
            : text.actions.verify}
        </Button>
      </div>

      {result && (
        <div
          className={
            result.valid
              ? "space-y-3 rounded border border-emerald-200 bg-emerald-50 p-4"
              : "space-y-3 rounded border border-red-200 bg-red-50 p-4"
          }
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <FileCheck2 className="size-5 text-emerald-700" />
            ) : (
              <AlertTriangle className="size-5 text-red-700" />
            )}
            <p className="font-semibold">
              {result.valid ? "Chứng chỉ hợp lệ" : "Chứng chỉ không hợp lệ"}
            </p>
          </div>
          <p>
            <strong>exists:</strong> {String(result.exists)}
          </p>
          <p>
            <strong>valid:</strong> {String(result.valid)}
          </p>
          <p>
            <strong>certificateId:</strong> {result.certificateId || "-"}
          </p>
          <p>
            <strong>studentName:</strong> {result.studentName || "-"}
          </p>
          <p>
            <strong>issuer:</strong> {result.issuer || "-"}
          </p>
          <p>
            <strong>issueTimestamp:</strong> {result.issueTimestamp || "-"}
          </p>
          <p className="break-all">
            <strong>documentHash:</strong> {result.documentHash || "-"}
          </p>
          <p>
            <strong>message:</strong> {result.message || "-"}
          </p>
        </div>
      )}
    </div>
  );
}
