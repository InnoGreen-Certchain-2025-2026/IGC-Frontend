import { useState, useRef, useCallback } from "react";
import { useSignature } from "@/hooks/useSignature";
import SignatureCropper from "./SignatureCropper"; // ✅ NEW

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

  // ✅ NEW: crop states
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [step, setStep] = useState<UploadStep>("select");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    loading,
    error,
    isSignatureUsed,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  } = useSignature();

  /* =========================================================
     SELECT FILE → OPEN CROPPER
     ========================================================= */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        setRawImage(e.target?.result as string);
        setShowCropper(true); // 👉 mở cropper
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  /* =========================================================
     AFTER CROP
     ========================================================= */
  const handleCropComplete = useCallback((file: File) => {
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setShowCropper(false);
  }, []);

  /* =========================================================
     CLOSE
     ========================================================= */
  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRawImage(null);
    setShowCropper(false);
    setStep("select");
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  /* =========================================================
     UPLOAD
     ========================================================= */
  const handleUploadSignature = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setStep("uploading");

      await uploadSignatureFile(orgId, selectedFile);

      toast.success(
        hasExistingSignature
          ? "Đã cập nhật chữ ký"
          : "Đăng ký chữ ký thành công",
      );

      setShowConfirmDialog(false);
      handleClose();
      onSuccess?.();
    } catch (err: any) {
      setStep("select");
      toast.error(err.message || "Upload thất bại");
    }
  }, [
    selectedFile,
    orgId,
    uploadSignatureFile,
    hasExistingSignature,
    handleClose,
    onSuccess,
  ]);

  /* =========================================================
     CHECK
     ========================================================= */
  const handleCheckAndUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setStep("checking");

      const isUsed = await checkSignatureFile(orgId, selectedFile);

      if (isUsed) {
        setShowConfirmDialog(true);
        setStep("select");
      } else {
        await handleUploadSignature();
      }
    } catch (err: any) {
      setStep("select");
      toast.error(err.message || "Kiểm tra thất bại");
    }
  }, [selectedFile, orgId, checkSignatureFile, handleUploadSignature]);

  /* =========================================================
     UI
     ========================================================= */
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {hasExistingSignature ? "Đặt chữ ký thay thế" : "Đăng ký chữ ký"}
            </DialogTitle>
            <DialogDescription>
              Tải lên và crop chữ ký của bạn
            </DialogDescription>
          </DialogHeader>

          {step === "select" && (
            <div className="space-y-4">
              {/* Upload */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Upload className="mx-auto mb-2" />
                <p>Chọn ảnh chữ ký</p>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    className="w-full h-32 object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2"
                  >
                    <X />
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Hủy
                </Button>
                <Button
                  onClick={handleCheckAndUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? "Đang xử lý..." : "Tiếp tục"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ CROPPER */}
      {showCropper && rawImage && (
        <SignatureCropper
          imageSrc={rawImage}
          open={showCropper}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* CONFIRM */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Chữ ký đã tồn tại</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn muốn thay thế chữ ký hiện tại?
          </AlertDialogDescription>

          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleUploadSignature}>
              Xác nhận
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
