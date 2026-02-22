import type { OrganizationRole } from "./OrganizationRole";

export interface OrganizationMemberResponse {
  userId: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: OrganizationRole;
}
