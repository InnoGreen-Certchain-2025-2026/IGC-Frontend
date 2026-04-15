import axiosInstance from "@/lib/axiosInstance";
import type { AxiosError } from "axios";

/**
 * Extract error message from axios error response
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's an axios error with response data
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.data?.errorMessage) {
      return axiosError.response.data.errorMessage;
    }
    return error.message;
  }
  return "Lỗi không xác định";
}

/**
 * Check if uploaded signature file is valid and if it's already in use
 * Calls backend API: POST /api/signature/check
 *
 * @param orgId - Organization ID
 * @param file - Signature image file to validate
 * @returns Promise<boolean> - true if signature is already used, false if new signature
 * @throws Error if file is not a valid signature or validation fails
 */
export async function checkSignature(
  orgId: number,
  file: File,
): Promise<boolean> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post<any>(
      "/api/signature/check",
      formData,
      {
        params: {
          orgId,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error checking signature:", error);
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

/**
 * Upload and save signature for organization
 * Replaces existing signature if present
 * Calls backend API: POST /api/signature/upload
 *
 * @param orgId - Organization ID
 * @param file - Signature image file to upload
 * @returns Promise<boolean> - true if upload successful
 * @throws Error if file is not a valid signature or upload fails
 */
export async function uploadSignature(
  orgId: number,
  originalFile: File,
  croppedFile: File
): Promise<boolean> {
  const formData = new FormData();
  formData.append("originalFile", originalFile);
  formData.append("croppedFile", croppedFile);

  try {
    const response = await axiosInstance.post<any>(
      "/api/signature/upload",
      formData,
      {
        params: { orgId },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error uploading signature:", error);
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

/**
 * Helper function to validate file before sending to backend
 *
 * @param file - File to validate
 * @returns boolean - true if file looks like an image
 */
export function isValidSignatureFile(file: File): boolean {
  if (!file) return false;

  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  const isValidType = validTypes.includes(file.type);
  const maxSize = 5 * 1024 * 1024; // 5MB
  const isValidSize = file.size <= maxSize;

  return isValidType && isValidSize;
}

/**
 * Check if an organization has an existing signature
 * Calls backend API: GET /api/signature/exist?orgId={orgId}
 *
 * @param orgId - Organization ID
 * @returns Promise<boolean> - true if organization has a signature, false otherwise
 */
export async function checkOrganizationHasSignature(
  orgId: number,
): Promise<boolean> {
  try {
    const response = await axiosInstance.get<any>("/api/signature/exist", {
      params: {
        orgId,
      },
    });

    return response.data.data || false;
  } catch (error) {
    console.error("Error checking if organization has signature:", error);
    // Return false on error - assume no signature
    return false;
  }
}

/**
 * Get file size in human readable format
 */
export function getFileSizeLabel(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}