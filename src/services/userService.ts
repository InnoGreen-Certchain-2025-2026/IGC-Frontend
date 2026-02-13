import axiosInstance from "../lib/axiosInstance";
import type { ApiResponse } from "../types/base/ApiResponse";
import type { UserSessionResponse } from "../types/user/UserSessionResponse";

export const getMeApi = async (): Promise<ApiResponse<UserSessionResponse>> => {
  const response = await axiosInstance.get<ApiResponse<UserSessionResponse>>(
    "/users/me",
  );
  return response.data;
};
