import axiosInstance from "@/lib/axiosInstance";
import type { AxiosError } from "axios";

/**
 * Extract error message from axios error response
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.data?.errorMessage) {
      return axiosError.response.data.errorMessage;
    }
    return error.message;
  }
  return "Lỗi không xác định";
}

/**
 * Send OTP to email
 * Calls backend API: POST /auth/send-otp
 *
 * @param email - User email
 * @returns Promise<boolean> - true if sent successfully
 */
export async function sendOtp(email: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post<any>("/auth/send-otp", {
      email,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error sending OTP:", error);
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

/**
 * Verify OTP
 * Calls backend API: POST /auth/verify-otp
 *
 * @param email - User email
 * @param otp - OTP code
 * @returns Promise<boolean> - true if OTP valid
 */
export async function verifyOtp(
  email: string,
  otp: string
): Promise<boolean> {
  try {
    const response = await axiosInstance.post<any>("/auth/verify-otp", {
      email,
      otp,
    });

    return response.data === true; // đúng với BE của bạn hiện tại
  } catch (error) {
    console.error("Error verifying OTP:", error);
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}