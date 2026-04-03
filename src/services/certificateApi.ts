import axiosInstance from "@/lib/axiosInstance";
import {
  ApiBusinessError,
  type ApiResponse,
  type CertificateDraftPayload,
  type CertificateRecord,
  type ClaimCertificateResponse,
  type SignCertificatePayload,
  type VerifyCertificateFileResponse,
} from "@/types/certificate";

const hasBusinessError = (errorCode: number, errorMessage: string): boolean => {
  return errorCode !== 0 || errorMessage.trim().length > 0;
};

export function parseApiResponse<T>(
  response: ApiResponse<T | null>,
  fallback: T,
): T {
  const errorCode = response.errorCode ?? 0;
  const errorMessage = response.errorMessage ?? "";

  if (hasBusinessError(errorCode, errorMessage)) {
    throw new ApiBusinessError({ errorCode, errorMessage });
  }

  if (response.data === null || response.data === undefined) {
    return fallback;
  }

  return response.data;
}

export const createDraftCertificateApi = async (
  payload: CertificateDraftPayload,
): Promise<CertificateRecord> => {
  const response = await axiosInstance.post<
    ApiResponse<CertificateRecord | null>
  >("/api/certificates/draft", payload);

  const fallback: CertificateRecord = {
    certificateId: payload.certificateId,
    studentName: payload.studentName,
    status: "DRAFT",
  };

  return parseApiResponse(response.data, fallback);
};

export const getDraftCertificatesApi = async (): Promise<
  CertificateRecord[]
> => {
  const response = await axiosInstance.get<
    ApiResponse<CertificateRecord[] | null>
  >("/api/certificates/drafts");

  return parseApiResponse(response.data, []);
};

export const getSignedCertificatesApi = async (): Promise<
  CertificateRecord[]
> => {
  const response = await axiosInstance.get<
    ApiResponse<CertificateRecord[] | null>
  >("/api/certificates/signed");

  return parseApiResponse(response.data, []);
};

export const getRevokedCertificatesApi = async (): Promise<
  CertificateRecord[]
> => {
  const response = await axiosInstance.get<
    ApiResponse<CertificateRecord[] | null>
  >("/api/certificates/revoked");

  return parseApiResponse(response.data, []);
};

export const signCertificateApi = async (
  payload: SignCertificatePayload,
): Promise<CertificateRecord> => {
  const formData = new FormData();
  formData.append("signatureImage", payload.signatureImage);
  formData.append("userCertificate", payload.userCertificate);
  formData.append("certificatePassword", payload.certificatePassword);
  formData.append("x", String(payload.x));
  formData.append("y", String(payload.y));
  formData.append("width", String(payload.width));
  formData.append("height", String(payload.height));

  const response = await axiosInstance.post<
    ApiResponse<CertificateRecord | null>
  >(`/api/certificates/${payload.certificateId}/sign`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return parseApiResponse(response.data, {
    certificateId: payload.certificateId,
    studentName: "",
    status: "SIGNED",
  });
};

export const revokeCertificateApi = async (
  certificateId: string,
): Promise<CertificateRecord> => {
  const response = await axiosInstance.delete<
    ApiResponse<CertificateRecord | null>
  >(`/api/certificates/${certificateId}/revoke`);

  return parseApiResponse(response.data, {
    certificateId,
    studentName: "",
    status: "REVOKED",
  });
};

export const reissueCertificateApi = async (
  certificateId: string,
): Promise<CertificateRecord> => {
  const response = await axiosInstance.post<
    ApiResponse<CertificateRecord | null>
  >(`/api/certificates/${certificateId}/reissue`);

  return parseApiResponse(response.data, {
    certificateId,
    studentName: "",
    status: "DRAFT",
  });
};

export const getClaimCertificatePreviewApi = async (
  claimCode: string,
): Promise<ClaimCertificateResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<ClaimCertificateResponse | null>
  >(`/api/certificates/claim/${encodeURIComponent(claimCode)}`);

  return parseApiResponse(response.data, {
    certificateId: "",
    studentName: "",
  });
};

export const claimCertificateOwnershipApi = async (
  claimCode: string,
): Promise<ClaimCertificateResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<ClaimCertificateResponse | null>
  >(`/api/certificates/claim/${encodeURIComponent(claimCode)}`);

  return parseApiResponse(response.data, {
    certificateId: "",
    studentName: "",
    isClaim: true,
  });
};

export const downloadClaimCertificatePdfApi = async (
  claimCode: string,
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `/api/certificates/claim/${encodeURIComponent(claimCode)}/download`,
    {
      responseType: "blob",
    },
  );

  return response.data as Blob;
};

export const verifyCertificateByPdfFileApi = async (
  pdfFile: File,
): Promise<VerifyCertificateFileResponse> => {
  const formData = new FormData();
  formData.append("pdfFile", pdfFile);

  const response = await axiosInstance.post<
    ApiResponse<VerifyCertificateFileResponse | null>
  >("/api/certificates/verify/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return parseApiResponse(response.data, {
    exists: false,
    valid: false,
    certificateId: "",
    studentName: "",
    issuer: "",
    issueTimestamp: "",
    documentHash: "",
    message: "",
  });
};

export const verifyCertificateByIdApi = async (
  certificateId: string,
): Promise<VerifyCertificateFileResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<VerifyCertificateFileResponse | null>
  >(`/api/certificates/${encodeURIComponent(certificateId)}/verify`);

  return parseApiResponse(response.data, {
    exists: false,
    valid: false,
    certificateId: "",
    studentName: "",
    issuer: "",
    issueTimestamp: "",
    documentHash: "",
    message: "",
  });
};

export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
