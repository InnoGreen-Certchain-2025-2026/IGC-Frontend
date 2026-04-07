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

interface SignatureUploadProps {
  orgId: number;
  onSuccess?: () => void;
}

/**
 * Example component demonstrating signature upload and confirmation flow
 *
 * Flow:
 * 1. User selects signature image file
 * 2. File is checked against backend (validity + duplicate check)
 * 3. If used, show confirmation dialog
 * 4. If confirmed, signature is saved
 */
export function SignatureUploadExample({
  orgId,
  onSuccess,
}: SignatureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    loading,
    error,
    signatureData,
    isSignatureUsed,
    checkSignatureFile,
    confirmSignatureUpload,
    reset,
  } = useSignature();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    reset();

    // Check the signature
    const result = await checkSignatureFile(orgId, file);

    if (result && isSignatureUsed) {
      // Show confirmation dialog if signature is already used
      setShowConfirmDialog(true);
    } else if (result) {
      // Auto-confirm if signature is not used
      await handleConfirmSignature(result.hash);
    }
  };

  const handleConfirmSignature = async (hash: string) => {
    const success = await confirmSignatureUpload(orgId, hash);

    if (success) {
      toast.success("Tải chữ ký lên thành công");
      setShowConfirmDialog(false);
      setPreviewUrl(null);
      onSuccess?.();
    } else {
      toast.error(error || "Xác nhận chữ ký thất bại");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tải chữ ký lên</h3>

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
              Nhấp để tải lên hoặc kéo thả tệp
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
              alt="Xem trước chữ ký"
              className="max-h-40 border rounded"
            />
          </div>
        )}

        {/* Error message */}
        {error && !isSignatureUsed && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center text-sm text-gray-500">
            Đang xử lý chữ ký...
          </div>
        )}

        {/* Confirmation Dialog for used signatures */}
        {signatureData && isSignatureUsed && (
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogContent>
              <AlertDialogTitle>Chữ ký đã được sử dụng</AlertDialogTitle>
              <AlertDialogDescription>
                Chữ ký này đã được đăng ký cho tổ chức của bạn. Bạn có muốn
                thay thế chữ ký hiện tại bằng chữ ký này không?
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (signatureData?.hash) {
                      handleConfirmSignature(signatureData.hash);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? "Đang xác nhận..." : "Thay thế chữ ký"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Card>
  );
}
