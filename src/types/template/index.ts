import type { ApiResponse } from "@/types/base/ApiResponse";

export type TemplateFieldType = "text" | "date" | "number" | "image";
export type TemplateFieldAlign = "left" | "center" | "right";

export interface TemplateField {
  id: string;
  name: string;
  type: TemplateFieldType;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  fontFamily?: string;
  align?: TemplateFieldAlign;
  color?: string;
}

export type TemplateFieldRequest = TemplateField;

export interface SaveSchemaRequest {
  id: number;
  fields: TemplateFieldRequest[];
}

export interface TemplateResponse {
  id: string;
  orgId: number;
  name: string;
  pdfStorageKey?: string;
  pdfUrl?: string;
  fields: TemplateField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateUploadPayload {
  orgId: number;
  name: string;
  fields: TemplateFieldRequest[];
  pdfFile: File;
}

export interface BatchStartResponse {
  batchId: string;
  status: string;
  message: string;
}

export interface BatchProgressError {
  rowNumber: number;
  certificateId?: string;
  error: string;
}

export interface BatchProgressResponse {
  batchId: string;
  status: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  failureCount: number;
  progressPercent: number;
  currentMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  errors: BatchProgressError[];
}

export interface BulkCertificateUploadPayload {
  orgId: number;
  excelFile: File;
  userCertificate: File;
  certificatePassword: string;
}

export interface TemplateListResponse extends ApiResponse<TemplateResponse[]> {}
