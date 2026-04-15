import { useState } from "react";
import { useSignature } from "@/hooks/useSignature";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SignatureCropDialog } from "./SignatureCropDialog";

interface SignatureUploadProps {
  orgId: number;
  onSuccess?: () => void;
}

export function SignatureUploadExample({
  orgId,
  onSuccess,
}: SignatureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const [showCrop, setShowCrop] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    loading,
    error,
    isSignatureUsed,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  } = useSignature();

  // 👉 chọn file
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    reset();

    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setShowCrop(true); // mở crop
    };
    reader.readAsDataURL(file);
  };

  // 👉 sau khi crop
  const handleCropDone = async (data: { original: File; resized: File }) => {
    console.log("🔥 ORIGINAL:", data.original.size);
    console.log("🔥 RESIZED:", data.resized.size);

    setCroppedFile(data.resized); // dùng để upload

    try {
      // 👉 QUAN TRỌNG: check bằng ảnh FULL
      const isValid = await checkSignatureFile(orgId, data.original);

      if (!isValid) {
        toast.error("Đây không phải chữ ký hợp lệ");
        return;
      }

      setShowConfirmDialog(true);
    } catch (err) {
      console.error("❌ ERROR:", err);
      toast.error("Lỗi khi kiểm tra chữ ký");
    }
  };

  // 👉 upload
  const handleUpload = async (original: File, cropped: File) => {
    const success = await uploadSignatureFile(orgId, original, cropped);

    if (success) {
      toast.success("Tải chữ ký thành công");
      handleReset();
      onSuccess?.();
    } else {
      toast.error(error || "Lỗi khi tải chữ ký");
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setOriginalFile(null);
    setCroppedFile(null);
    setShowCrop(false);
    setShowConfirmDialog(false);
    reset();
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tải lên chữ ký</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
            id="signature-upload"
          />
          <label htmlFor="signature-upload" className="cursor-pointer block">
            <p className="text-sm text-gray-600">
              Nhấp để tải lên hoặc kéo và thả
            </p>
            <p className="text-xs text-gray-400">JPG hoặc PNG (tối đa 5MB)</p>
          </label>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Xem trước:</p>
            <img
              src={previewUrl}
              alt="Signature preview"
              className="max-h-40 border rounded"
            />
          </div>
        )}

        {/* Error */}
        {error && !isSignatureUsed && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center text-sm text-gray-500">
            Đang xử lý chữ ký...
          </div>
        )}

        {/* Confirm dialog */}
        {isSignatureUsed && originalFile && croppedFile && (
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogContent>
              <AlertDialogTitle>Chữ ký đã được sử dụng</AlertDialogTitle>
              <AlertDialogDescription>
                Chữ ký này đã tồn tại. Bạn có muốn thay thế không?
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpload(originalFile, croppedFile)}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Thay thế chữ ký"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* 👉 Crop dialog */}
      {showCrop && previewUrl && (
        <SignatureCropDialog
          image={previewUrl}
          onCropDone={handleCropDone}
          onCancel={() => setShowCrop(false)}
        />
      )}
    </Card>
  );
}
