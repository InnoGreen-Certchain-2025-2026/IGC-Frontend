import { useState, useCallback } from "react";
import {
  checkSignature,
  uploadSignature,
  isValidSignatureFile,
} from "@/services/signatureService";

interface UseSignatureReturn {
  loading: boolean;
  error: string | null;
  isSignatureUsed: boolean;

  // Methods
  checkSignatureFile: (orgId: number, file: File) => Promise<boolean | null>;
  uploadSignatureFile: (orgId: number, file: File) => Promise<boolean>;
  reset: () => void;
}

/**
 * Map backend error messages to user-friendly Vietnamese messages
 */
function getUserFriendlyErrorMessage(error: string): string {
  const lowerError = error.toLowerCase();

  // Check for invalid signature format errors
  if (
    lowerError.includes("not a valid signature") ||
    lowerError.includes("không phải chữ ký hợp lệ") ||
    lowerError.includes("invalid signature")
  ) {
    return "Chữ ký không phù hợp. Vui lòng tải lên ảnh chữ ký hợp lệ.";
  }

  // Check for file format errors
  if (
    lowerError.includes("file is required") ||
    lowerError.includes("tệp được yêu cầu")
  ) {
    return "Vui lòng chọn tệp chữ ký để tải lên.";
  }

  // Return original error if no mapping found
  return error;
}

/**
 * Custom hook for managing signature upload flow
 *
 * Usage:
 * const { loading, error, checkSignatureFile, uploadSignatureFile } = useSignature();
 *
 * // In component
 * const handleFileSelect = async (file: File) => {
 *   const isUsed = await checkSignatureFile(orgId, file);
 *   if (!isUsed) {
 *     await uploadSignatureFile(orgId, file);
 *   } else {
 *     // Show confirmation dialog
 *     // If confirmed, call uploadSignatureFile(orgId, file)
 *   }
 * }
 */
export function useSignature(): UseSignatureReturn & {
  warning: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isSignatureUsed, setIsSignatureUsed] = useState(false);

  const extractError = (err: any) => {
    return err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
  };

  const checkSignatureFile = useCallback(
    async (orgId: number, file: File): Promise<boolean | null> => {
      try {
        setLoading(true);
        setError(null);
        setWarning(null);

        if (!isValidSignatureFile(file)) {
          setError("Tệp không hợp lệ. JPG/PNG <= 5MB");
          return null;
        }

        const isUsed = await checkSignature(orgId, file);
        setIsSignatureUsed(isUsed);

        if (isUsed) {
          setWarning("Chữ ký đã tồn tại. Bạn có muốn thay thế không?");
        }

        return isUsed;
      } catch (err) {
        setError(getUserFriendlyErrorMessage(extractError(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const uploadSignatureFile = useCallback(
    async (orgId: number, file: File): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const result = await uploadSignature(orgId, file);

        if (result) {
          setIsSignatureUsed(false);
          setWarning(null);
          return true;
        }
        return false;
      } catch (err) {
        setError(getUserFriendlyErrorMessage(extractError(err)));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setWarning(null);
    setIsSignatureUsed(false);
  }, []);

  return {
    loading,
    error,
    warning,
    isSignatureUsed,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  };
}
