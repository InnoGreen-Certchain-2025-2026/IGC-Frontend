import { useState, useCallback } from "react";
import {
  checkSignature,
  confirmSignature,
  isValidSignatureFile,
  type CheckSignatureResponse,
} from "@/services/signatureService";

interface UseSignatureReturn {
  loading: boolean;
  error: string | null;
  signatureData: CheckSignatureResponse | null;
  isSignatureUsed: boolean;

  // Methods
  checkSignatureFile: (
    orgId: number,
    file: File,
  ) => Promise<CheckSignatureResponse | null>;
  confirmSignatureUpload: (orgId: number, hash: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Custom hook for managing signature upload and confirmation flow
 *
 * Usage:
 * const { loading, error, checkSignatureFile, confirmSignatureUpload } = useSignature();
 *
 * // In component
 * const handleFileSelect = async (file: File) => {
 *   const result = await checkSignatureFile(orgId, file);
 *   if (result && !result.isUsed) {
 *     await confirmSignatureUpload(orgId, result.hash);
 *   }
 * }
 */
export function useSignature(): UseSignatureReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureData, setSignatureData] =
    useState<CheckSignatureResponse | null>(null);

  const checkSignatureFile = useCallback(
    async (
      orgId: number,
      file: File,
    ): Promise<CheckSignatureResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        // Client-side validation first
        if (!isValidSignatureFile(file)) {
          setError("Invalid file. Please upload a JPG or PNG image (max 5MB)");
          return null;
        }

        // Call backend API
        const result = await checkSignature(orgId, file);
        setSignatureData(result);

        // Warn if signature is already used
        if (result.isUsed) {
          setError(
            "This signature is already in use. Choose another or confirm to replace.",
          );
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check signature";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const confirmSignatureUpload = useCallback(
    async (orgId: number, hash: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const result = await confirmSignature(orgId, hash);

        if (result) {
          setSignatureData(null); // Clear after successful confirmation
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to confirm signature";
        setError(errorMessage);
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
    setSignatureData(null);
  }, []);

  return {
    loading,
    error,
    signatureData,
    isSignatureUsed: signatureData?.isUsed ?? false,
    checkSignatureFile,
    confirmSignatureUpload,
    reset,
  };
}
