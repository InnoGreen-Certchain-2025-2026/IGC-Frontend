import type { OrganizationRole } from "./OrganizationRole";

export type OrganizationInviteStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED"
  | "EXPIRED";

export interface OrganizationInviteResponse {
  id: number;
  inviteToken: string;
  organizationId: number;
  organizationName: string;
  organizationCode: string;
  organizationLogoUrl: string;
  inviteeEmail: string;
  inviterName: string;
  inviterEmail: string;
  invitedRole: OrganizationRole;
  status: OrganizationInviteStatus;
  expiresAt: string;
  createdAt: string;
}
