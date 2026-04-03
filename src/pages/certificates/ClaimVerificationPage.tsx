import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useClaimCertificateOwnership,
  useClaimCertificatePreview,
  useDownloadClaimCertificate,
} from "@/hooks/useCertificates";
import { useAppSelector } from "@/features/hooks";
import { downloadBlobAsFile } from "@/services/certificateApi";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import { ApiBusinessError } from "@/types/certificate";

export default function ClaimVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];
  const [inputCode, setInputCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);

  const claimQuery = useClaimCertificatePreview(submittedCode);
  const ownershipClaimMutation = useClaimCertificateOwnership();
  const downloadMutation = useDownloadClaimCertificate();

  useEffect(() => {
    const claimCode =
      typeof (location.state as { claimCode?: unknown } | null)?.claimCode ===
      "string"
        ? ((location.state as { claimCode?: string }).claimCode ?? "")
        : "";

    if (claimCode.trim()) {
      setInputCode(claimCode.trim());
      setSubmittedCode(claimCode.trim());
    }
  }, [location.state]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const claimCode = inputCode.trim();
    setSubmittedCode(claimCode);
    setIsClaimed(false);
  };

  const handleClaimOwnership = async () => {
    if (!submittedCode) {
      return;
    }

    if (!isAuthenticated) {
      toast.error(text.notifications.claimNeedLogin);
      navigate("/auth", {
        state: {
          from: "/claim",
        },
      });
      return;
    }

    try {
      const result = await ownershipClaimMutation.mutateAsync(submittedCode);
      setIsClaimed(Boolean(result.isClaim ?? true));
      toast.success(text.notifications.claimSuccess);
      navigate("/usr/certificates");
    } catch (error) {
      if (error instanceof ApiBusinessError) {
        const normalizedMessage = error.message.toLowerCase();
        if (
          normalizedMessage.includes("khác") ||
          normalizedMessage.includes("other")
        ) {
          toast.error(text.notifications.claimClaimedByOther);
          return;
        }

        toast.error(error.message);
        return;
      }

      toast.error(text.notifications.unexpectedError);
    }
  };

  const handleDownload = async () => {
    if (!submittedCode) return;

    try {
      const blob = await downloadMutation.mutateAsync(submittedCode);
      downloadBlobAsFile(blob, `${submittedCode}.pdf`);
      toast.success("Tải tệp PDF thành công.");
    } catch {
      toast.error(text.notifications.unexpectedError);
    }
  };

  const showFriendlyError = claimQuery.isError;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-semibold">Tra cứu mã nhận chứng chỉ</h1>
        <p className="text-muted-foreground text-sm">
          Bước 1: xem trước thông tin theo mã nhận. Bước 2: đăng nhập để nhận
          chứng chỉ vào tài khoản.
        </p>
      </header>

      <Card className="p-5">
        <form className="space-y-3" onSubmit={submit}>
          <Label htmlFor="claimCode">Mã nhận</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="claimCode"
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
              placeholder="Nhập mã nhận chứng chỉ"
            />
            <Button type="submit" disabled={!inputCode.trim()}>
              {text.actions.claimLookup}
            </Button>
          </div>
        </form>
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/verify")}
          >
            {text.actions.verifyByFile}
          </Button>
        </div>
      </Card>

      {claimQuery.isLoading ? (
        <Card className="space-y-3 p-5">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </Card>
      ) : null}

      {showFriendlyError ? (
        <Card className="space-y-2 border-red-200 bg-red-50 p-5 text-red-700">
          <h2 className="text-lg font-semibold">Xác thực thất bại</h2>
          <p className="text-sm">
            {claimQuery.error instanceof ApiBusinessError
              ? claimQuery.error.message
              : text.notifications.claimInvalid}
          </p>
          <p className="text-sm">
            Vui lòng liên hệ đơn vị cấp chứng chỉ để được hỗ trợ thêm.
          </p>
        </Card>
      ) : null}

      {claimQuery.data ? (
        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Thông tin chứng chỉ</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <p>
              <span className="font-medium">Mã chứng chỉ:</span>{" "}
              {claimQuery.data.certificateId}
            </p>
            <p>
              <span className="font-medium">Sinh viên:</span>{" "}
              {claimQuery.data.studentName}
            </p>
            <p>
              <span className="font-medium">Loại chứng chỉ:</span>{" "}
              {claimQuery.data.certificateType ?? "-"}
            </p>
            <p>
              <span className="font-medium">Ngày cấp:</span>{" "}
              {claimQuery.data.issueDate ?? "-"}
            </p>
            <p>
              <span className="font-medium">Trạng thái:</span>{" "}
              {claimQuery.data.status ?? "-"}
            </p>
            <p>
              <span className="font-medium">Đơn vị cấp:</span>{" "}
              {claimQuery.data.issuer ?? "-"}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
          >
            {downloadMutation.isPending
              ? "Đang tải..."
              : text.actions.downloadPdf}
          </Button>

          <Button
            type="button"
            variant={isClaimed ? "secondary" : "default"}
            onClick={handleClaimOwnership}
            disabled={ownershipClaimMutation.isPending || isClaimed}
          >
            {ownershipClaimMutation.isPending
              ? "Đang nhận..."
              : isClaimed
                ? text.actions.claimed
                : text.actions.claimOwnership}
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
