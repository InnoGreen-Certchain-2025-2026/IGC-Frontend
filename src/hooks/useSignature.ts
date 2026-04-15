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
  uploadSignatureFile: (
    orgId: number,
    originalFile: File,
    croppedFile: File,
  ) => Promise<boolean>;
  reset: () => void;
}

/**
 * Map backend error messages to user-friendly Vietnamese messages
 */
function getUserFriendlyErrorMessage(error: string): string {
  const lowerError = error.toLowerCase();

  if (
    lowerError.includes("not a valid signature") ||
    lowerError.includes("không phải chữ ký hợp lệ") ||
    lowerError.includes("invalid signature")
  ) {
    return "Chữ ký không phù hợp. Vui lòng tải lên ảnh chữ ký hợp lệ.";
  }

  if (
    lowerError.includes("file is required") ||
    lowerError.includes("tệp được yêu cầu")
  ) {
    return "Vui lòng chọn tệp chữ ký để tải lên.";
  }

  return error;
}

export function useSignature(): UseSignatureReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignatureUsed, setIsSignatureUsed] = useState(false);

  /**
   * Check signature (chỉ dùng file gốc để hash)
   */
  const checkSignatureFile = useCallback(
    async (orgId: number, file: File): Promise<boolean | null> => {
      try {
        setLoading(true);
        setError(null);

        // validate file gốc
        if (!isValidSignatureFile(file)) {
          setError(
            "Tệp không hợp lệ. Vui lòng tải lên ảnh JPG hoặc PNG (tối đa 5MB)",
          );
          return null;
        }

        const isUsed = await checkSignature(orgId, file);
        // Backend currently returns whether the image is a valid signature.
        // Keep this field for backward compatibility with existing UI components.
        setIsSignatureUsed(false);

        return isUsed;
      } catch (err) {
        const rawErrorMessage =
          err instanceof Error ? err.message : "Lỗi khi kiểm tra chữ ký";
        setError(getUserFriendlyErrorMessage(rawErrorMessage));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Upload signature (2 file: original + cropped)
   */
  const uploadSignatureFile = useCallback(
    async (
      orgId: number,
      originalFile: File,
      croppedFile: File,
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        // validate cả 2 file
        if (!isValidSignatureFile(originalFile)) {
          setError("Ảnh gốc không hợp lệ (JPG/PNG, tối đa 5MB)");
          return false;
        }

        if (!isValidSignatureFile(croppedFile)) {
          setError("Ảnh đã cắt không hợp lệ");
          return false;
        }

        const result = await uploadSignature(orgId, originalFile, croppedFile);

        if (result) {
          setIsSignatureUsed(false);
          return true;
        }

        return false;
      } catch (err) {
        const rawErrorMessage =
          err instanceof Error ? err.message : "Lỗi khi tải chữ ký lên";
        setError(getUserFriendlyErrorMessage(rawErrorMessage));
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
    setIsSignatureUsed(false);
  }, []);

  return {
    loading,
    error,
    isSignatureUsed,
    checkSignatureFile,
    uploadSignatureFile,
    reset,
  };
}
