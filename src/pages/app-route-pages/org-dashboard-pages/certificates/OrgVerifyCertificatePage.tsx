import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import type { VerifyResponse } from "@/types/certificate/VerifyResponse";
import { verifyCertificateByFileApi } from "@/services/certificateService";

export default function OrgVerifyCertificatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleFileVerify = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await verifyCertificateByFileApi(file);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Xác thực bằng file thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
          disabled={loading || !file}
          onClick={handleFileVerify}
          className="mt-2"
        >
          {loading ? "Đang kiểm tra..." : "Kiểm tra"}
        </Button>
      </div>

      {result && (
        <div className="p-4 border rounded">
          <p>
            <strong>Kết quả:</strong> {result.valid ? "Hợp lệ" : "Không hợp lệ"}
          </p>
          <p>
            <strong>Thông điệp:</strong> {result.message}
          </p>
          {result.exists && (
            <>
              <p>
                <strong>Mã:</strong> {result.certificateId}
              </p>
              <p>
                <strong>Người nhận:</strong> {result.studentName}
              </p>
              <p>
                <strong>Đơn vị cấp:</strong> {result.issuer}
              </p>
              <p>
                <strong>Thời gian cấp:</strong> {result.issueTimestamp}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
