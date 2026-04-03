import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CreateDraftForm } from "@/components/certificates/CreateDraftForm";
import { Card } from "@/components/ui/card";
import { useCreateDraftCertificate } from "@/hooks/useCertificates";
import type { CertificateDraftPayload } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import { ApiBusinessError } from "@/types/certificate";

export default function CreateDraftPage() {
  const navigate = useNavigate();
  const { orgCode } = useParams<{ orgCode: string }>();
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const createDraftMutation = useCreateDraftCertificate();

  const handleSubmit = async (payload: CertificateDraftPayload) => {
    try {
      const result = await createDraftMutation.mutateAsync(payload);
      toast.success(text.notifications.createDraftSuccess);
      navigate(`/org/${orgCode}/certificates`, {
        state: {
          activeTab: "DRAFT",
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
    <Card className="p-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Tạo chứng chỉ bản nháp</h2>
        <p className="text-muted-foreground text-sm">
          Điền đầy đủ thông tin bắt buộc rồi xác nhận để tạo chứng chỉ ở trạng
          thái bản nháp.
        </p>
      </div>

      <CreateDraftForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/org/${orgCode}/certificates`)}
        isSubmitting={createDraftMutation.isPending}
      />
    </Card>
  );
}
