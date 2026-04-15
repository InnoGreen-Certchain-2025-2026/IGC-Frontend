import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CertificatesSkeleton } from "@/components/certificates/CertificatesSkeleton";
import { CertificatesTable } from "@/components/certificates/CertificatesTable";
import { CertificateEmptyState } from "@/components/certificates/CertificateEmptyState";
import {
  useCertificateDashboardData,
  useReissueCertificate,
  useRevokeCertificate,
} from "@/hooks/useCertificates";
import type { CertificateRecord } from "@/types/certificate";
import { CERTIFICATE_TEXTS, DEFAULT_LOCALE } from "@/pages/certificates/texts";
import { ApiBusinessError } from "@/types/certificate";
import { Grid2x2, Search } from "lucide-react";

interface LocationState {
  highlightCertificateId?: string;
  activeTab?: "SIGNED" | "REVOKED";
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
  const location = useLocation();
  const text = CERTIFICATE_TEXTS[DEFAULT_LOCALE];

  const locationState = (location.state ?? {}) as LocationState;
  const [activeTab, setActiveTab] = useState<"SIGNED" | "REVOKED">(
    locationState.activeTab ?? "SIGNED",
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  const { signedQuery, revokedQuery, isLoading } =
    useCertificateDashboardData();

  const revokeMutation = useRevokeCertificate();
  const reissueMutation = useReissueCertificate();

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

  const highlightId = locationState.highlightCertificateId;

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-br from-[#214e41] via-[#336b59] to-[#1a3a32] p-5 shadow-md text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
              Tổng quan
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {text.dashboardTitle}
            </h2>
            <p className="max-w-3xl text-sm text-slate-100">
              {text.dashboardDescription}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row" />
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex flex-1 items-center h-11 px-3 md:px-4 bg-white border-2 border-[#183930] rounded-full shadow-md transition-all duration-300 hover:border-[#4f9b5a]">
            <Search className="size-4 text-[#214e41] shrink-0" />
            <Input
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder={text.searchPlaceholder}
              className="grow bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-900 px-2 md:px-3 placeholder:text-slate-400 h-full font-medium min-w-0"
            />
          </div>
          <Badge className="gap-1 w-fit bg-[#f2ce3c] text-[#214e41] font-semibold">
            <Grid2x2 className="size-3.5" />
            {signed.length + revoked.length} chứng chỉ
          </Badge>
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "SIGNED" | "REVOKED")}
      >
        <TabsList className="rounded-xl bg-white border border-slate-200 p-1">
          <TabsTrigger
            value="SIGNED"
            className="data-[state=active]:bg-[#214e41] data-[state=active]:text-white"
          >
            {text.tabs.signed}
          </TabsTrigger>
          <TabsTrigger
            value="REVOKED"
            className="data-[state=active]:bg-[#214e41] data-[state=active]:text-white"
          >
            {text.tabs.revoked}
          </TabsTrigger>
        </TabsList>

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
              onRevoke={async () => undefined}
              onReissue={async (certificateId) => {
                try {
                  await reissueMutation.mutateAsync(certificateId);
                  toast.success(text.notifications.reissueSuccess);
                  setActiveTab("SIGNED");
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
    </div>
  );
}
