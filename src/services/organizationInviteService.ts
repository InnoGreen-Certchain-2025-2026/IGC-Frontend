import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { CreateOrganizationInviteRequest } from "@/types/organization/CreateOrganizationInviteRequest";

/**
 * Mời người dùng vào tổ chức.
 */
export const inviteUserToOrganizationApi = async (
  organizationId: number,
  request: CreateOrganizationInviteRequest,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post<ApiResponse<string>>(
    `/organizations/${organizationId}/invites`,
    request,
  );
  return response.data;
};

/**
 * Chấp nhận lời mời vào tổ chức.
 */
export const acceptOrganizationInviteApi = async (
  token: string,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/organizations/invites/${token}/accept`,
  );
  return response.data;
};

/**
 * Từ chối lời mời vào tổ chức.
 */
export const declineOrganizationInviteApi = async (
  token: string,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/organizations/invites/${token}/decline`,
  );
  return response.data;
};

/**
 * Huỷ lời mời đã gửi.
 */
export const cancelOrganizationInviteApi = async (
  token: string,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/organizations/invites/${token}/cancel`,
  );
  return response.data;
};
