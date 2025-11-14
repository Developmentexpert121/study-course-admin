import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  searchTerm?: string;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  loading,
  searchTerm,
  onPageChange,
}: PaginationControlsProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="block items-center justify-between gap-4 sm:flex">
        <div className="mb-3 text-center text-sm text-gray-600 dark:text-white sm:mb-0 sm:text-left">
          Page{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalPages}
          </span>
          {searchTerm && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              (Filtered results)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span className="xs:inline hidden">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-500 dark:text-white"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isActive = currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  disabled={loading}
                  className={`rounded-lg px-3 py-2 text-sm shadow-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#02517b] font-semibold text-white dark:bg-[#43bf79] dark:text-gray-900"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <span className="xs:inline hidden">Next</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
