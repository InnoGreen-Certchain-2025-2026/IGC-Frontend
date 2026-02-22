import type { OrganizationRole } from "./OrganizationRole";

export interface OrganizationSummaryResponse {
  id: number;
  name: string;
  code: string;
  domain: string;
  logoUrl: string;
  description: string;
  role: OrganizationRole;
}
