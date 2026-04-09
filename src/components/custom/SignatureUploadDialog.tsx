import { useState, useRef } from "react";
import { useSignature } from "@/hooks/useSignature";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Upload, Check, AlertCircle, Loader2, X } from "lucide-react";

interface SignatureUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: number;
  hasExistingSignature: boolean;
  onSuccess?: () => void;
}

type UploadStep = "select" | "checking" | "uploading";

/**
 * Dialog component for uploading signature
 *
 * Flow:
 * 1. User selects file
 * 2. Check if signature is valid and if already used (call /check)
 * 3. If already used, show confirmation dialog
 * 4. User confirms or cancels
 * 5. If confirmed, upload signature (call /upload)
 */
export function SignatureUploadDialog({
  open,
  onOpenChange,
  orgId,
  hasExistingSignature,
  onSuccess,
}: SignatureUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<UploadStep>("select");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    loading,
    error,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  } = useSignature();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckAndUpload = async () => {
    if (!selectedFile) return;

    setStep("checking");
    const isUsed = await checkSignatureFile(orgId, selectedFile);

    if (isUsed === null) {
      // Error during check - show toast and go back to select
      if (
        error &&
        (error.includes("không phù hợp") || error.includes("không hợp lệ"))
      ) {
        // Show error in select step
        setStep("select");
      } else {
        // For other errors, show toast
        setStep("select");
        toast.error(error || "Kiểm tra chữ ký thất bại. Vui lòng thử lại.");
      }
      return;
    }

    if (isUsed) {
      // Signature already used - show confirmation dialog
      setShowConfirmDialog(true);
      setStep("select");
    } else {
      // New signature - upload directly
      await handleUploadSignature();
    }
  };

  const handleUploadSignature = async () => {
    if (!selectedFile) return;

    setStep("uploading");
    const success = await uploadSignatureFile(orgId, selectedFile);

    if (success) {
      toast.success(
        hasExistingSignature
          ? "Đã cập nhật chữ ký thành công"
          : "Đã đăng ký chữ ký thành công",
      );
      setShowConfirmDialog(false);
      handleClose();
      onSuccess?.();
    } else {
      setStep("select");
      toast.error(error || "Không thể lưu chữ ký. Vui lòng thử lại.");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStep("select");
    reset();
    onOpenChange(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {hasExistingSignature ? "Đặt chữ ký thay thế" : "Đăng ký chữ ký"}
            </DialogTitle>
            <DialogDescription>
              {hasExistingSignature
                ? "Tải lên chữ ký mới để thay thế chữ ký hiện tại"
                : "Tải lên hình ảnh chữ ký của bạn (JPG hoặc PNG)"}
            </DialogDescription>
          </DialogHeader>

          {/* Note/Requirements */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Yêu cầu chữ ký:</p>
              <p>• Chữ ký phải là nền trắng</p>
              <p>• Chữ ký phải nằm trọn trong hình không được vượt quá viền</p>
            </div>
          </div>

          {step === "select" && (
            <div className="space-y-4">
              {/* Upload area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Upload className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Nhấp để chọn hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG hoặc PNG, tối đa 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Xem trước:
                  </p>
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Signature preview"
                      className="w-full h-40 object-cover border border-gray-200 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {selectedFile && (
                    <p className="text-xs text-gray-500">
                      {selectedFile.name} •{" "}
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCheckAndUpload}
                  disabled={!selectedFile || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Tiếp tục
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "checking" && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Đang kiểm tra chữ ký...</p>
            </div>
          )}

          {step === "uploading" && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Đang tải chữ ký lên...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for duplicate signatures */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Chữ ký đã được sử dụng
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Chữ ký này đã được đăng ký cho tổ chức của bạn rồi. Bạn có muốn
              thay thế chữ ký hiện tại bằng chữ ký này không?
            </p>
            {previewUrl && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Signature"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </AlertDialogDescription>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUploadSignature}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Thay thế chữ ký"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
