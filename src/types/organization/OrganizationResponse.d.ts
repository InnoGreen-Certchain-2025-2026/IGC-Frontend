export interface OrganizationResponse {
  id: number;

  name: string;
  code: string;
  domain: string;
  logoUrl: string;
  description: string;

  // THÔNG TIN PHÁP LÝ
  legalName: string;
  taxCode: string;
  legalAddress: string;
  representativeName: string;

  // THÔNG TIN LIÊN HỆ
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // THÔNG TIN DỊCH VỤ
  servicePlan: "FREE" | "PRO" | "ENTERPRISE";
}
