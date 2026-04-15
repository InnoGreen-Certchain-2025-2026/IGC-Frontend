import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CreateDraftForm } from "@/components/certificates/CreateDraftForm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCreateDraftCertificate } from "@/hooks/useCertificates";
import type { CertificateDraftPayload } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import { ApiBusinessError } from "@/types/certificate";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

export default function CreateDraftPage() {
  const navigate = useNavigate();
  const { orgCode } = useParams<{ orgCode: string }>();
  const { orgId } = useOrganizationContext();
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const createDraftMutation = useCreateDraftCertificate();

  const handleSubmit = async (payload: {
    request: CertificateDraftPayload;
    userCertificate: File;
    certificatePassword: string;
  }) => {
    if (!orgId) {
      toast.error("Không tìm thấy tổ chức đang chọn");
      return;
    }

    try {
      const result = await createDraftMutation.mutateAsync({
        ...payload,
        organizationId: orgId,
      });
      toast.success("Tạo chứng chỉ thành công");
      navigate(`/org/${orgCode}/certificates`, {
        state: {
          activeTab: "SIGNED",
          highlightCertificateId: result.certificateId,
        },
      });
    } catch (error) {
      if (error instanceof ApiBusinessError) {
        toast.error(error.message);
        return;
      }
      toast.error(text.notifications.unexpectedError);
    }
  };

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-[#214e41] via-[#336b59] to-[#1a3a32] p-5 shadow-md text-white">
        <div className="space-y-2">
          <Badge className="w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
            Tạo bản nháp
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Tạo chứng chỉ bản nháp
          </h2>
          <p className="max-w-3xl text-sm text-slate-100">
            Điền đầy đủ thông tin bắt buộc rồi xác nhận để tạo chứng chỉ ở trạng
            thái bản nháp.
          </p>
        </div>
      </header>

      <Card className="p-5">
        <CreateDraftForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/org/${orgCode}/certificates`)}
          isSubmitting={createDraftMutation.isPending}
        />
      </Card>
    </div>
  );
}
