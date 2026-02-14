import type { UserProfileResponse } from "@/types/user/UserProfileResponse";
import axiosInstance from "../lib/axiosInstance";
import type { ApiResponse } from "../types/base/ApiResponse";
import type { UserSessionResponse } from "../types/user/UserSessionResponse";
import type { UpdateProfileRequest } from "@/types/user/UpdateProfileRequest";

export const getMeApi = async (): Promise<ApiResponse<UserSessionResponse>> => {
  const response = await axiosInstance.get<ApiResponse<UserSessionResponse>>(
    "/users/me",
  );
  return response.data;
};

export const getUserProfileApi = async (): Promise<ApiResponse<UserProfileResponse>> => {
  const response = await axiosInstance.get<ApiResponse<UserProfileResponse>>(
    "/users/me/profile",
  );
  return response.data;
};

export const updateUserProfileApi = async (data: UpdateProfileRequest): Promise<void> => {
  const response = await axiosInstance.post(
    "/users/me/profile",
    data
  );
  return response.data;
};

