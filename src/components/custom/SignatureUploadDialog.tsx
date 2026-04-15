import { useState, useRef } from "react";
import { useSignature } from "@/hooks/useSignature";
import { useOtp } from "@/hooks/useOTP";
import { useCurrentUser } from "@/hooks/useCurrentUser";
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
import { Input } from "@/components/ui/input";
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

  const { user } = useCurrentUser(); // ✅ lấy user
  const userEmail = user?.email; // ⚠️ nếu BE khác thì sửa lại field này

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showCrop, setShowCrop] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const [otp, setOtp] = useState("");

  const {
    loading,
    error,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  } = useSignature();

  const { handleSendOtp, handleVerifyOtp } = useOtp();

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
    setCroppedFile(data.resized);
    setShowCrop(false);

    setTimeout(async () => {
      try {
        const isValid = await checkSignatureFile(orgId, data.original);

        if (!isValid) {
          toast.error("Đây không phải chữ ký hợp lệ");
          return;
        }

        setShowConfirmDialog(true);
      } catch (err) {
        toast.error("Lỗi khi kiểm tra chữ ký");
      }
    }, 0);
  };

  // 👉 confirm → gửi OTP
  const handleConfirmReplace = async () => {
    try {
      if (!userEmail) {
        toast.error("Không lấy được email người dùng");
        return;
      }

      console.log("Sending OTP to:", userEmail);

      const ok = await handleSendOtp(userEmail);

      if (ok) {
        toast.success("Đã gửi OTP về email");
        setShowConfirmDialog(false);
        setShowOtpDialog(true);
      } else {
        toast.error("Gửi OTP thất bại");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // 👉 verify OTP → upload
  const handleVerifyOtpAndUpload = async () => {
    try {
      if (!userEmail) {
        toast.error("Không lấy được email người dùng");
        return;
      }

      const valid = await handleVerifyOtp(userEmail, otp);

      if (!valid) {
        toast.error("OTP không đúng");
        return;
      }

      const success = await uploadSignatureFile(
        orgId,
        selectedFile!,
        croppedFile!
      );

      if (success) {
        toast.success("Upload thành công");
        handleClose();
        onSuccess?.();
      } else {
        toast.error(error || "Upload thất bại");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCroppedFile(null);
    setPreviewUrl(null);
    setShowCrop(false);
    setShowConfirmDialog(false);
    setShowOtpDialog(false);
    setOtp("");
    reset();
    onOpenChange(false);
  };

  return (
    <>
      {/* Upload dialog */}
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
          <AlertDialogTitle>Xác nhận thay đổi chữ ký</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn thay đổi chữ ký? Hệ thống sẽ gửi OTP để xác nhận.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>
              Xác nhận
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* OTP dialog */}
      <AlertDialog open={showOtpDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Nhập OTP</AlertDialogTitle>
          <AlertDialogDescription>
            Vui lòng nhập OTP đã gửi về email của bạn
          </AlertDialogDescription>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập OTP"
          />

          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setShowOtpDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleVerifyOtpAndUpload}>
              Xác nhận
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}