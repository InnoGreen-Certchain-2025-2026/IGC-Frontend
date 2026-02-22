import { useState, useRef } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router";
import { useAppSelector, useAppDispatch } from "@/features/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback, getS3Url } from "@/lib/utils";
import { updateUserAvatarApi } from "@/services/userService";
import { fetchMe } from "@/features/user/userThunk";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import type { AxiosError } from "axios";
import ImageCropperComponent from "@/components/custom/ImageCropperComponent";

const TABS = [
  { to: "/account/profile", label: "Hồ sơ" },
  { to: "/account/security", label: "Bảo mật" },
];

/**
 * Account layout with avatar header and tab navigation.
 * Renders profile / security sub-pages via <Outlet />.
 */
export default function AccountLayout() {
  const dispatch = useAppDispatch();
  const { name, email, avatarUrl } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState("");

  /* Redirect bare /account to /account/profile */
  if (pathname === "/account") {
    return <Navigate to="/account/profile" replace />;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Create object URL and open cropper
    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setCropperOpen(true);

    // Reset input so user can select the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    // Revoke the object URL to free memory
    if (cropperSrc) {
      URL.revokeObjectURL(cropperSrc);
      setCropperSrc("");
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    // Close cropper first
    setCropperOpen(false);
    if (cropperSrc) {
      URL.revokeObjectURL(cropperSrc);
      setCropperSrc("");
    }

    // Upload the cropped image
    setUploadingAvatar(true);
    try {
      await updateUserAvatarApi(croppedFile);
      toast.success("Cập nhật ảnh đại diện thành công!");
      dispatch(fetchMe());
    } catch (error) {
      const axiosError = error as AxiosError<{ errorMessage?: string }>;
      const message =
        axiosError.response?.data?.errorMessage ||
        "Cập nhật ảnh đại diện thất bại";
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Avatar header ── */}
      <div className="flex flex-col items-center gap-2 pt-2 pb-6">
        <div
          className="relative group cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Avatar className="h-24 w-24 shadow-md border-2 border-white">
            <AvatarImage
              src={getS3Url(avatarUrl)}
              alt={name ?? ""}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl font-bold">
              {getAvatarFallback(name)}
            </AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {uploadingAvatar ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {name ?? "Người dùng"}
          </p>
          <p className="text-sm text-gray-500">{email ?? ""}</p>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex justify-center border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* ── Sub-page content ── */}
      <Outlet />

      {/* ── Image Cropper Modal ── */}
      <ImageCropperComponent
        imageSrc={cropperSrc}
        open={cropperOpen}
        onClose={handleCropperClose}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
