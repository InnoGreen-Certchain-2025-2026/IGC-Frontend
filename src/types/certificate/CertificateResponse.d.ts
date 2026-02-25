export interface CertificateResponse {
  id: number;
  certificateId: string;
  studentName: string;
  studentId: string;
  dateofBirth: string;
  major: string;
  graduationYear: number;
  gpa: number;
  certificateType: string;
  issuer: string;
  issueDate: string;
  signedPdfHash: string;
  blockchainTxHash: string;
  blockchainBlockNumber: string;
  blockchainTimestamp: string;
  isValid: boolean;
  createdAt: string;
}