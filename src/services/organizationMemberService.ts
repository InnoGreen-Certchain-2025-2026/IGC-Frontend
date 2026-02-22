import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/base/ApiResponse";

/**
 * Thăng cấp thành viên lên Moderator.
 */
export const promoteToModeratorApi = async (
  organizationId: number,
  userId: number,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/organizations/${organizationId}/members/${userId}/promote-moderator`,
  );
  return response.data;
};

/**
 * Hạ cấp Moderator xuống Member.
 */
export const demoteToMemberApi = async (
  organizationId: number,
  userId: number,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    `/organizations/${organizationId}/members/${userId}/demote-member`,
  );
  return response.data;
};

/**
 * Kick thành viên khỏi tổ chức.
 */
export const kickMemberApi = async (
  organizationId: number,
  userId: number,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(
    `/organizations/${organizationId}/members/${userId}`,
  );
  return response.data;
};
