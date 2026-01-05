import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit?: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  limit = 10,
  loading = false,
  onPageChange,
  hasActiveFilters = false,
  className = "",
}: PaginationProps) {
  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate item range
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
    >
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Page Info */}
        <div className="text-center text-sm text-gray-600 dark:text-white sm:text-left">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalCount}
            </span>
          </div>
          <div className="mt-1">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPages}
            </span>
            {hasActiveFilters && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (Filtered results)
              </span>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="Previous page"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => {
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const showEllipsis =
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span
                      key={`ellipsis-${page}`}
                      className="px-2 text-gray-500 dark:text-white"
                    >
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    disabled={loading}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm shadow-sm transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#02517b] font-semibold text-white dark:bg-[#43bf79] dark:text-gray-900"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {page}
                  </button>
                );
              }
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || loading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="Next page"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}