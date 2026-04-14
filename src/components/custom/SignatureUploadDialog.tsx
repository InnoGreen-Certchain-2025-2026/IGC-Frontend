import { useState, useRef } from "react";
import { useSignature } from "@/hooks/useSignature";
import { SignatureCropDialog } from "./SignatureCropDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface SignatureUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: number;
  hasExistingSignature: boolean;
  onSuccess?: () => void;
}

export function SignatureUploadDialog({
  open,
  onOpenChange,
  orgId,
  hasExistingSignature,
  onSuccess,
}: SignatureUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showCrop, setShowCrop] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    loading,
    error,
    checkSignatureFile, // 👉 chỉ dùng check chữ ký
    uploadSignatureFile,
    reset,
  } = useSignature();

  // 👉 chọn file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);

      onOpenChange(false);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  // 👉 crop xong
  const handleCropDone = (data: { original: File; resized: File }) => {
    console.log("🔥 ORIGINAL:", data.original.size);
    console.log("🔥 RESIZED:", data.resized.size);

    setCroppedFile(data.resized);

    // 👉 ĐÓNG CROP NGAY (QUAN TRỌNG)
    setShowCrop(false);

    // 👉 CHẠY API ASYNC (KHÔNG BLOCK UI)
    setTimeout(async () => {
      try {
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
    }, 0);
  };

  // 👉 upload (sau khi user confirm)
  const handleUpload = async () => {
    if (!selectedFile || !croppedFile) return;

    const success = await uploadSignatureFile(orgId, selectedFile, croppedFile);

    if (success) {
      toast.success("Upload thành công");
      handleClose();
      onSuccess?.();
    } else {
      toast.error(error || "Upload thất bại");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCroppedFile(null);
    setPreviewUrl(null);
    setShowCrop(false);
    setShowConfirmDialog(false);
    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload chữ ký</DialogTitle>
            <DialogDescription>Upload ảnh và crop chữ ký</DialogDescription>
          </DialogHeader>

          <div
            className="border-2 border-dashed p-6 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="mx-auto mb-2" />
            <p>Chọn ảnh</p>
          </div>

          {previewUrl && (
            <img src={previewUrl} className="mt-4 max-h-40 mx-auto" />
          )}
        </DialogContent>
      </Dialog>

      {/* crop */}
      {showCrop && previewUrl && (
        <SignatureCropDialog
          image={previewUrl}
          onCropDone={handleCropDone}
          onCancel={() => setShowCrop(false)}
        />
      )}

      {/* confirm */}
      <AlertDialog open={showConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận đăng ký chữ ký</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có muốn sử dụng chữ ký này không?
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpload}>Đồng ý</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
