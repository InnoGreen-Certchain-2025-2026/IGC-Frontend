import axiosInstance from "@/lib/axiosInstance";

export interface CheckSignatureResponse {
  hash: string;
  isUsed: boolean;
}

export interface SignatureCheckResult {
  hash: string;
  isUsed: boolean;
}

/**
 * Check if uploaded signature file is valid
 * Calls backend API: POST /api/signature/check
 *
 * @param orgId - Organization ID
 * @param file - Signature image file to validate
 * @returns Promise containing hash and isUsed status
 * @throws Error if validation fails
 */
export async function checkSignature(
  orgId: number,
  file: File,
): Promise<CheckSignatureResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("orgId", orgId.toString());

  try {
    const response = await axiosInstance.post<any>(
      "/api/signature/check",
      formData,
      {
        params: {
          orgId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error checking signature:", error);
    throw error;
  }
}

/**
 * Confirm and save signature for organization
 * Replaces existing signature if present
 * Calls backend API: POST /api/signature/confirm
 *
 * @param orgId - Organization ID
 * @param hash - Hash of the signature (returned from checkSignature)
 * @returns Promise<boolean> - true if confirmation successful
 * @throws Error if confirmation fails
 */
export async function confirmSignature(
  orgId: number,
  hash: string,
): Promise<boolean> {
  try {
    const response = await axiosInstance.post<any>(
      "/api/signature/confirm",
      undefined,
      {
        params: {
          orgId,
          hash,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error confirming signature:", error);
    throw error;
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
 * Get file size in human readable format
 */
export function getFileSizeLabel(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
