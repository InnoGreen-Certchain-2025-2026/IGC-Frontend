export type CertificateStatus = "DRAFT" | "SIGNED" | "REVOKED" | "EXPIRED";

export interface ApiResponse<T> {
  errorCode: number;
  errorMessage: string;
  data: T;
}

export interface CertificateDraftPayload {
  certificateId: string;
  studentName: string;
  dateOfBirth: string;
  major: string;
  graduationYear: number;
  gpa: number;
  certificateType: string;
  issueDate: string;
}

export interface CertificateRecord {
  id?: number;
  certificateId: string;
  studentName: string;
  dateOfBirth?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  certificateType?: string;
  issueDate?: string;
  status: CertificateStatus;
  claimCode?: string;
  claimExpiry?: string;
  isValid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignCertificatePayload {
  certificateId: string;
  signatureImage: File;
  userCertificate: File;
  certificatePassword: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ClaimCertificateResponse {
  certificateId: string;
  studentName: string;
  major?: string;
  graduationYear?: number;
  issueDate?: string;
  certificateType?: string;
  issuer?: string;
  status?: CertificateStatus;
  claimCode?: string;
  claimExpiry?: string;
  isClaim?: boolean;
  studentId?: string | number | null;
}

export interface VerifyCertificateFileResponse {
  exists: boolean;
  valid: boolean;
  certificateId: string;
  studentName: string;
  issuer: string;
  issueTimestamp: string;
  documentHash: string;
  message: string;
}

export interface WorkflowApiError {
  errorCode: number;
  errorMessage: string;
}

export class ApiBusinessError extends Error {
  errorCode: number;

  constructor(payload: WorkflowApiError) {
    super(payload.errorMessage || "Business error");
    this.name = "ApiBusinessError";
    this.errorCode = payload.errorCode;
  }
}
