import type { ApiResponse } from "../types/base/ApiResponse";
import type { LoginRequest } from "../types/auth/LoginRequest";
import type { RegisterRequest } from "../types/auth/RegisterRequest";
import type { DefaultAuthResponse } from "../types/auth/DefaultAuthResponse";
import axiosInstance from "@/lib/axiosInstance";
import type { UpdatePasswordRequest } from "@/types/auth/UpdatePasswordRequest";

export const loginApi = async (
  request: LoginRequest,
): Promise<ApiResponse<DefaultAuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<DefaultAuthResponse>>(
    "/auth/login",
    request,
  );
  return response.data;
};

export const registerApi = async (request: RegisterRequest): Promise<void> => {
  await axiosInstance.post("/auth/register", request);
};

export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout", null);
};

export const updatePasswordApi = async (
  data: UpdatePasswordRequest,
): Promise<void> => {
  const response = await axiosInstance.post("/auth/password", data);
  return response.data;
};
