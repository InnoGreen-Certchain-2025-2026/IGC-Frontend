export interface CreateOrganizationRequest {
  // THÔNG TIN CHUNG
  name: string;
  code: string;
  domain?: string;
  description?: string;

  // THÔNG TIN PHÁP LÝ
  legalName: string;
  taxCode: string;
  legalAddress: string;
  representativeName?: string;

  // THÔNG TIN LIÊN HỆ
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // THÔNG TIN GÓI DỊCH VỤ
  servicePlan: "BASIC" | "PRO" | "ENTERPRISE";
}
