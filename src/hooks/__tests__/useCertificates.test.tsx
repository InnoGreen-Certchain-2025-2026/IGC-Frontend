import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useCertificateDashboardData } from "@/hooks/useCertificates";

vi.mock("@/services/certificateApi", () => ({
  getDraftCertificatesApi: vi.fn(async () => [
    {
      certificateId: "DRAFT-01",
      studentName: "Draft Student",
      status: "DRAFT",
    },
  ]),
  getSignedCertificatesApi: vi.fn(async () => [
    {
      certificateId: "SIGNED-01",
      studentName: "Signed Student",
      status: "SIGNED",
    },
  ]),
  getRevokedCertificatesApi: vi.fn(async () => [
    {
      certificateId: "REVOKED-01",
      studentName: "Revoked Student",
      status: "REVOKED",
    },
  ]),
  createDraftCertificateApi: vi.fn(),
  signCertificateApi: vi.fn(),
  revokeCertificateApi: vi.fn(),
  reissueCertificateApi: vi.fn(),
  getClaimCertificatePreviewApi: vi.fn(),
  claimCertificateOwnershipApi: vi.fn(),
  downloadClaimCertificatePdfApi: vi.fn(),
  verifyCertificateByPdfFileApi: vi.fn(),
  verifyCertificateByIdApi: vi.fn(),
}));

describe("useCertificateDashboardData", () => {
  it("loads draft, signed and revoked lists", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCertificateDashboardData(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.draftQuery.data).toHaveLength(1);
      expect(result.current.signedQuery.data).toHaveLength(1);
      expect(result.current.revokedQuery.data).toHaveLength(1);
    });

    expect(result.current.draftQuery.data?.[0].certificateId).toBe("DRAFT-01");
    expect(result.current.signedQuery.data?.[0].certificateId).toBe(
      "SIGNED-01",
    );
    expect(result.current.revokedQuery.data?.[0].certificateId).toBe(
      "REVOKED-01",
    );
  });
});
