import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationBarProps {
  /** Current page (0-indexed). */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the new page number (0-indexed). */
  onPageChange: (page: number) => void;
  /** Max visible page buttons (default 5). */
  maxVisible?: number;
}

/**
 * Reusable pagination bar built on top of the shadcn Pagination primitives.
 * Handles ellipsis, previous/next, and page number buttons.
 */
export default function PaginationBar({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  /** Build the list of page numbers to show (0-indexed). */
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, page - half);
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = end - maxVisible + 1;
    }

    const pages: (number | "ellipsis")[] = [];

    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(0, page - 1))}
            aria-disabled={page === 0}
            className={
              page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
                className="cursor-pointer"
              >
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            aria-disabled={page >= totalPages - 1}
            className={
              page >= totalPages - 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
