import axios from "axios";
import type { ApiResponse } from "../types/base/ApiResponse";
import type { LoginRequest } from "../types/auth/LoginRequest";
import type { RegisterRequest } from "../types/auth/RegisterRequest";
import type { DefaultAuthResponse } from "../types/auth/DefaultAuthResponse";
import axiosInstance from "@/lib/axiosInstance";
import type { UpdatePasswordRequest } from "@/types/auth/UpdatePasswordRequest";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginApi = async (
  request: LoginRequest,
): Promise<ApiResponse<DefaultAuthResponse>> => {
  const response = await axios.post<ApiResponse<DefaultAuthResponse>>(
    `${BASE_URL}/auth/login`,
    request,
    { withCredentials: true },
  );
  return response.data;
};

export const registerApi = async (request: RegisterRequest): Promise<void> => {
  await axios.post(`${BASE_URL}/auth/register`, request);
};

export const logoutApi = async (): Promise<void> => {
  await axios.post(`${BASE_URL}/auth/logout`, null, { withCredentials: true });
};

export const updatePasswordApi = async (
  data: UpdatePasswordRequest,
): Promise<void> => {
  const response = await axiosInstance.post("/auth/password", data);
  return response.data;
};
