import { OrganizationRole } from "./OrganizationRole";

export interface CreateOrganizationInviteRequest {
  inviteeEmail: string;
  invitedRole: OrganizationRole;
  inviteMessage?: string;
}
