import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/features/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload,Loader2 } from "lucide-react"; // Thêm icons
import type { CertificateRequest } from "@/types/certificate/CertificateRequest";
import {
  issueCertificateApi,
  extractCertificateFromImageApi,
} from "@/services/certificateService";
import type { AxiosError } from "axios";

export default function OrgCreateCertificatePage() {
  const navigate = useNavigate();

  const selectedOrg = useAppSelector(
      (state) => state.organization.selectedOrganization,
  );

  const [formData, setFormData] = useState<CertificateRequest>({
    certificateId: "",
    studentName: "",
    dateofBirth: "",
    major: "",
    graduationYear: new Date().getFullYear(),
    gpa: 0,
    certificateType: "",
    issueDate: new Date().toISOString().split("T")[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!selectedOrg?.id) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-gray-500">Không có tổ chức được chọn.</p>
        </div>
    );
  }

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
          name === "graduationYear" || name === "gpa"
              ? Number(value)
              : value,
    }));
  };

  const handleImageUpload = async (
      e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await extractCertificateFromImageApi(file);
      const data = res.data;

      if (!data) {
        toast.error("Không đọc được dữ liệu từ ảnh");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        certificateId: data.certificateId ?? prev.certificateId,
        studentName: data.studentName ?? prev.studentName,
        dateofBirth: data.dateofBirth ?? prev.dateofBirth,
        major: data.major ?? prev.major,
        graduationYear: data.graduationYear ?? prev.graduationYear,
        certificateType: data.certificateType ?? prev.certificateType,
        issueDate: data.issueDate ?? prev.issueDate,
        gpa: data.gpa ?? prev.gpa,
      }));

      toast.success("Đã tự điền thông tin từ ảnh");
    } catch (err) {
      console.error(err);
      toast.error("OCR thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orgId = selectedOrg?.id;
    if (!orgId || typeof orgId !== "number" || orgId <= 0) {
      toast.error("Không có tổ chức hợp lệ để tạo chứng chỉ");
      return;
    }

    setSubmitting(true);
    try {
      await issueCertificateApi(formData, orgId);
      toast.success("Chứng chỉ đã được tạo");
      navigate("../");
    } catch (err) {
      console.error(err);
      const axiosErr = err as AxiosError<{ errorMessage?: string }>;
      if (axiosErr.response?.data?.errorMessage) {
        toast.error(axiosErr.response.data.errorMessage);
      } else {
        toast.error("Không thể tạo chứng chỉ");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Section - Đặt ở trên cùng */}
        <div className="w-full">
          <Label className="text-base font-semibold mb-3 block">
            Upload ảnh chứng chỉ để tự động điền thông tin
          </Label>

          <div className="relative">
            <input
                id="certificateImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
            />

            <label
                htmlFor="certificateImage"
                className={`
              flex flex-col items-center justify-center
              w-full h-48 px-4 
              border-2 border-dashed rounded-lg
              cursor-pointer transition-all
              ${uploading
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                }
              ${uploadedImage ? 'h-auto' : ''}
            `}
            >
              {uploading ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-sm text-blue-600 font-medium">
                      Đang đọc dữ liệu từ ảnh...
                    </p>
                  </div>
              ) : uploadedImage ? (
                  <div className="w-full p-4">
                    <img
                        src={uploadedImage}
                        alt="Uploaded certificate"
                        className="max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-center text-gray-600 mt-3">
                      Click để tải ảnh khác
                    </p>
                  </div>
              ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-gray-200">
                      <Upload className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Click để tải ảnh chứng chỉ
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG (tối đa 10MB)
                      </p>
                    </div>
                  </div>
              )}
            </label>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          <Label className="text-base font-semibold mb-4 block">
            Thông tin chứng chỉ
          </Label>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="certificateId">Mã chứng chỉ</Label>
            <Input
                id="certificateId"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleChange}
                required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="studentName">Tên sinh viên</Label>
            <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateofBirth">Ngày sinh</Label>
            <Input
                id="dateofBirth"
                name="dateofBirth"
                type="date"
                value={formData.dateofBirth}
                onChange={handleChange}
                required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="major">Ngành học</Label>
            <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
            <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input
                id="gpa"
                name="gpa"
                type="number"
                step="0.01"
                value={formData.gpa}
                onChange={handleChange}
                required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="certificateType">Loại chứng chỉ</Label>
            <Input
                id="certificateType"
                name="certificateType"
                value={formData.certificateType}
                onChange={handleChange}
                required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="issueDate">Ngày cấp</Label>
            <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                required
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={() => navigate("../")}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Đang gửi..." : "Tạo chứng chỉ"}
          </Button>
        </div>
      </form>
  );
}