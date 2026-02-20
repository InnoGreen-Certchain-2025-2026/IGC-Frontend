import { useState, useEffect, useCallback } from "react";
import type { PageResponse } from "@/types/base/PageResponse";
import type { ApiResponse } from "@/types/base/ApiResponse";

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

interface UsePaginationReturn<T> {
  data: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  refresh: () => void;
}

/**
 * Generic hook for paginated API calls.
 *
 * @param fetchFn - API function that accepts (page, size) and returns ApiResponse<PageResponse<T>>
 * @param options - Optional initial page/size values
 */
export function usePagination<T>(
  fetchFn: (
    page: number,
    size: number,
  ) => Promise<ApiResponse<PageResponse<T>>>,
  options?: UsePaginationOptions,
): UsePaginationReturn<T> {
  const [page, setPage] = useState(options?.initialPage ?? 0);
  const [size, setSize] = useState(options?.initialSize ?? 10);
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn(page, size)
      .then((res) => {
        if (cancelled) return;
        const pageData = res.data;
        if (pageData) {
          setData(pageData.content);
          setTotalPages(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.errorMessage ?? "Đã xảy ra lỗi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchFn, page, size, refreshKey]);

  return {
    data,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    setPage,
    setSize,
    refresh,
  };
}
