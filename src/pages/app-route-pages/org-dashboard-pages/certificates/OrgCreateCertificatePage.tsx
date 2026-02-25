import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/features/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { CertificateRequest } from "@/types/certificate/CertificateRequest";
import { issueCertificateApi } from "@/services/certificateService";
import type { AxiosError } from "axios";

export default function OrgCreateCertificatePage() {
  const navigate = useNavigate();
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  if (!selectedOrg?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-gray-500">Không có tổ chức được chọn.</p>
      </div>
    );
  }

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // get organization id from store
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
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate("../")}>
          Hủy
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Đang gửi..." : "Tạo"}
        </Button>
      </div>
    </form>
  );
}
