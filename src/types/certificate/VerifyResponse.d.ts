export interface VerifyResponse {
  exists: boolean;
  valid: boolean;
  certificateId: string;
  studentName: string;
  issuer: string;
  issueTimestamp: string;
  documentHash: string;
  message: string;
}
