import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/base/ApiResponse";

export interface ContactFormRequest {
  fullName: string;
  email: string;
  company: string;
  description: string;
}

export const submitContactFormApi = async (
  data: ContactFormRequest,
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>("/contact", data);
  return response.data;
};
