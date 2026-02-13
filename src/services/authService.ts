import axios from "axios";
import type { ApiResponse } from "../types/base/ApiResponse";
import type { LoginRequest } from "../types/auth/LoginRequest";
import type { RegisterRequest } from "../types/auth/RegisterRequest";
import type { DefaultAuthResponse } from "../types/auth/DefaultAuthResponse";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const loginApi = async (
  request: LoginRequest
): Promise<ApiResponse<DefaultAuthResponse>> => {
  const response = await axios.post<ApiResponse<DefaultAuthResponse>>(
    `${BASE_URL}/auth/login`,
    request,
    {withCredentials: true}
  );
  return response.data;
};

export const registerApi = async (
  request: RegisterRequest
): Promise<void> => {
  await axios.post(
    `${BASE_URL}/auth/register`, 
    request
  );
};

