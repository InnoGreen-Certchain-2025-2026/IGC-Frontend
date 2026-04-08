import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimCertificateOwnershipApi,
  createDraftCertificateApi,
  downloadClaimCertificatePdfApi,
  getClaimCertificatePreviewApi,
  getDraftCertificatesApi,
  getRevokedCertificatesApi,
  getSignedCertificatesApi,
  reissueCertificateApi,
  revokeCertificateApi,
  signCertificateApi,
  verifyCertificateByIdApi,
  verifyCertificateByPdfFileApi,
} from "@/services/certificateApi";
import type {
  CertificateIssuePayload,
  CertificateRecord,
  ClaimCertificateResponse,
  SignCertificatePayload,
  VerifyCertificateFileResponse,
} from "@/types/certificate";

export const certificateQueryKeys = {
  draft: ["certificates", "drafts"] as const,
  signed: ["certificates", "signed"] as const,
  revoked: ["certificates", "revoked"] as const,
  claimPreview: (claimCode: string) =>
    ["certificates", "claim-preview", claimCode] as const,
};

export const useCertificateDashboardData = () => {
  const draftQuery = useQuery<CertificateRecord[]>({
    queryKey: certificateQueryKeys.draft,
    queryFn: getDraftCertificatesApi,
  });

  const signedQuery = useQuery<CertificateRecord[]>({
    queryKey: certificateQueryKeys.signed,
    queryFn: getSignedCertificatesApi,
  });

  const revokedQuery = useQuery<CertificateRecord[]>({
    queryKey: certificateQueryKeys.revoked,
    queryFn: getRevokedCertificatesApi,
  });

  return {
    draftQuery,
    signedQuery,
    revokedQuery,
    isLoading:
      draftQuery.isLoading || signedQuery.isLoading || revokedQuery.isLoading,
    isFetching:
      draftQuery.isFetching ||
      signedQuery.isFetching ||
      revokedQuery.isFetching,
  };
};

export const useCreateDraftCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CertificateIssuePayload) =>
      createDraftCertificateApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.draft,
      });
      await queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.signed,
      });
    },
  });
};

export const useSignCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignCertificatePayload) =>
      signCertificateApi(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: certificateQueryKeys.draft }),
        queryClient.invalidateQueries({
          queryKey: certificateQueryKeys.signed,
        }),
        queryClient.invalidateQueries({
          queryKey: certificateQueryKeys.revoked,
        }),
      ]);
    },
  });
};

export const useRevokeCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificateId: string) => revokeCertificateApi(certificateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.signed,
      });
      await queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.revoked,
      });
    },
  });
};

export const useReissueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificateId: string) => reissueCertificateApi(certificateId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: certificateQueryKeys.signed,
        }),
        queryClient.invalidateQueries({ queryKey: certificateQueryKeys.draft }),
        queryClient.invalidateQueries({
          queryKey: certificateQueryKeys.revoked,
        }),
      ]);
    },
  });
};

export const useClaimCertificatePreview = (claimCode: string) => {
  return useQuery<ClaimCertificateResponse>({
    queryKey: certificateQueryKeys.claimPreview(claimCode),
    queryFn: () => getClaimCertificatePreviewApi(claimCode),
    enabled: Boolean(claimCode.trim()),
    retry: false,
  });
};

export const useClaimCertificateOwnership = () => {
  return useMutation({
    mutationFn: (claimCode: string) => claimCertificateOwnershipApi(claimCode),
  });
};

export const useDownloadClaimCertificate = () => {
  return useMutation({
    mutationFn: (claimCode: string) =>
      downloadClaimCertificatePdfApi(claimCode),
  });
};

export const useVerifyCertificateByPdfFile = () => {
  return useMutation<VerifyCertificateFileResponse, Error, File>({
    mutationFn: (pdfFile: File) => verifyCertificateByPdfFileApi(pdfFile),
  });
};

export const useVerifyCertificateById = () => {
  return useMutation<VerifyCertificateFileResponse, Error, string>({
    mutationFn: (certificateId: string) =>
      verifyCertificateByIdApi(certificateId),
  });
};
