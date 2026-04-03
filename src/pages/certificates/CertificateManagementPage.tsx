import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificatesSkeleton } from "@/components/certificates/CertificatesSkeleton";
import { CertificatesTable } from "@/components/certificates/CertificatesTable";
import { CertificateEmptyState } from "@/components/certificates/CertificateEmptyState";
import { SignCertificateDialog } from "@/components/certificates/SignCertificateDialog";
import {
  useCertificateDashboardData,
  useReissueCertificate,
  useRevokeCertificate,
  useSignCertificate,
} from "@/hooks/useCertificates";
import type { CertificateRecord } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import { ApiBusinessError } from "@/types/certificate";

interface LocationState {
  highlightCertificateId?: string;
  activeTab?: "DRAFT" | "SIGNED" | "REVOKED";
}

const normalizeStatus = (record: CertificateRecord): CertificateRecord => {
  if (record.status) {
    return record;
  }

  if (record.isValid === false) {
    return { ...record, status: "REVOKED" };
  }

  return { ...record, status: "SIGNED" };
};

export default function CertificateManagementPage() {
  const { orgCode } = useParams<{ orgCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];

  const locationState = (location.state ?? {}) as LocationState;
  const [activeTab, setActiveTab] = useState<"DRAFT" | "SIGNED" | "REVOKED">(
    locationState.activeTab ?? "DRAFT",
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDraft, setSelectedDraft] = useState<CertificateRecord | null>(
    null,
  );

  const { draftQuery, signedQuery, revokedQuery, isLoading } =
    useCertificateDashboardData();

  const signMutation = useSignCertificate();
  const revokeMutation = useRevokeCertificate();
  const reissueMutation = useReissueCertificate();

  const drafts = useMemo(
    () => (draftQuery.data ?? []).map(normalizeStatus),
    [draftQuery.data],
  );

  const signed = useMemo(
    () =>
      (signedQuery.data ?? [])
        .map(normalizeStatus)
        .filter((record) => record.status !== "REVOKED"),
    [signedQuery.data],
  );

  const revoked = useMemo(
    () => (revokedQuery.data ?? []).map(normalizeStatus),
    [revokedQuery.data],
  );

  const filteredDrafts = drafts.filter((record) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;

    return (
      record.certificateId.toLowerCase().includes(keyword) ||
      record.studentName.toLowerCase().includes(keyword)
    );
  });

  const filteredSigned = signed.filter((record) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;

    return (
      record.certificateId.toLowerCase().includes(keyword) ||
      record.studentName.toLowerCase().includes(keyword)
    );
  });

  const filteredRevoked = revoked.filter((record) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;

    return (
      record.certificateId.toLowerCase().includes(keyword) ||
      record.studentName.toLowerCase().includes(keyword)
    );
  });

  const handleError = (error: unknown) => {
    if (error instanceof ApiBusinessError) {
      toast.error(error.message);
      return;
    }

    toast.error(text.notifications.unexpectedError);
  };

  const goToCreateDraft = () => {
    navigate(`/org/${orgCode}/certificates/create-draft`);
  };

  const highlightId = locationState.highlightCertificateId;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {text.dashboardTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {text.dashboardDescription}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={goToCreateDraft}>{text.actions.createDraft}</Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          className="w-full md:max-w-sm"
          placeholder={text.searchPlaceholder}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "DRAFT" | "SIGNED" | "REVOKED")
        }
      >
        <TabsList>
          <TabsTrigger value="DRAFT">{text.tabs.draft}</TabsTrigger>
          <TabsTrigger value="SIGNED">{text.tabs.signed}</TabsTrigger>
          <TabsTrigger value="REVOKED">{text.tabs.revoked}</TabsTrigger>
        </TabsList>

        <TabsContent value="DRAFT" className="pt-3">
          {isLoading ? (
            <CertificatesSkeleton />
          ) : filteredDrafts.length === 0 ? (
            <CertificateEmptyState
              title={text.tabs.draft}
              description={text.empty.draft}
              actionLabel={text.actions.createDraft}
              onAction={goToCreateDraft}
            />
          ) : (
            <CertificatesTable
              records={filteredDrafts}
              activeTab="DRAFT"
              highlightCertificateId={highlightId}
              onSign={(record) => setSelectedDraft(record)}
              onReissue={async () => undefined}
              onRevoke={async () => undefined}
              isReissuePending={false}
              isRevokePending={false}
            />
          )}
        </TabsContent>

        <TabsContent value="SIGNED" className="pt-3">
          {isLoading ? (
            <CertificatesSkeleton />
          ) : filteredSigned.length === 0 ? (
            <CertificateEmptyState
              title={text.tabs.signed}
              description={text.empty.signed}
            />
          ) : (
            <CertificatesTable
              records={filteredSigned}
              activeTab="SIGNED"
              highlightCertificateId={highlightId}
              onSign={() => undefined}
              onReissue={async () => undefined}
              onRevoke={async (certificateId) => {
                try {
                  await revokeMutation.mutateAsync(certificateId);
                  toast.success(text.notifications.revokeSuccess);
                } catch (error) {
                  handleError(error);
                }
              }}
              isReissuePending={false}
              isRevokePending={revokeMutation.isPending}
            />
          )}
        </TabsContent>

        <TabsContent value="REVOKED" className="pt-3">
          {isLoading ? (
            <CertificatesSkeleton />
          ) : filteredRevoked.length === 0 ? (
            <CertificateEmptyState
              title={text.tabs.revoked}
              description={text.empty.revoked}
            />
          ) : (
            <CertificatesTable
              records={filteredRevoked}
              activeTab="REVOKED"
              highlightCertificateId={highlightId}
              onSign={() => undefined}
              onRevoke={async () => undefined}
              onReissue={async (certificateId) => {
                try {
                  await reissueMutation.mutateAsync(certificateId);
                  toast.success(text.notifications.reissueSuccess);
                  setActiveTab("DRAFT");
                } catch (error) {
                  handleError(error);
                }
              }}
              isReissuePending={reissueMutation.isPending}
              isRevokePending={false}
            />
          )}
        </TabsContent>
      </Tabs>

      <SignCertificateDialog
        open={Boolean(selectedDraft)}
        certificate={selectedDraft}
        isSubmitting={signMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDraft(null);
          }
        }}
        onSubmit={async (payload) => {
          try {
            const result = await signMutation.mutateAsync(payload);
            toast.success(text.notifications.signSuccess);
            if (result.claimCode || result.claimExpiry) {
              toast.info(
                `Mã nhận: ${result.claimCode ?? "-"} | Hạn nhận: ${result.claimExpiry ?? "-"}`,
              );
            }
            setSelectedDraft(null);
            setActiveTab("SIGNED");
          } catch (error) {
            handleError(error);
          }
        }}
      />
    </div>
  );
}
