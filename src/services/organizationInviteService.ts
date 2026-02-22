import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { CreateOrganizationInviteRequest } from "@/types/organization/CreateOrganizationInviteRequest";
import type { OrganizationInviteResponse } from "@/types/organization/OrganizationInviteResponse";

/**
 * Lấy danh sách lời mời theo user (có phân trang).
 */
export const getInvitesByUserApi = async (
  userId: number,
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<OrganizationInviteResponse>>> => {
  const response = await axiosInstance.get<
    ApiResponse<PageResponse<OrganizationInviteResponse>>
  >(`/organizations/invites/users/${userId}`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * Lấy danh sách lời mời theo tổ chức (có phân trang).
 */
export const getInvitesByOrganizationApi = async (
  organizationId: number,
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<OrganizationInviteResponse>>> => {
  const response = await axiosInstance.get<
    ApiResponse<PageResponse<OrganizationInviteResponse>>
  >(`/organizations/${organizationId}/invites`, {
    params: { page, size },
  });
  return response.data;
};

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
