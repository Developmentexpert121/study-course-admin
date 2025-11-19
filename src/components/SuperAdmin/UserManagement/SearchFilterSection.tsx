// components/SuperAdmin/UserManagement/SearchFilterSection.tsx
import React from "react";
import { Search } from "lucide-react";

// Updated interface - using accountStatus instead of verificationStatus
interface SearchFilterSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  accountStatus: string; // Changed back to accountStatus
  onAccountStatusChange: (value: string) => void; // Changed back to onAccountStatusChange
  onSearch: () => void;
  onClearSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
  hasRole: boolean;
  roleName: string;
  hasActiveFilters: boolean;
  activeSearchTerm?: string;
  activeAccountStatus?: string; // Changed back to activeAccountStatus
  availableRoles?: any[];
  selectedRoleId?: string | null;
  onRoleChange?: (roleId: string) => void;
}

export default function SearchFilterSection({
  searchTerm,
  onSearchTermChange,
  accountStatus, // Changed back to accountStatus
  onAccountStatusChange, // Changed back to onAccountStatusChange
  onSearch,
  onClearSearch,
  onKeyPress,
  loading,
  hasRole,
  roleName,
  hasActiveFilters,
  activeSearchTerm,
  activeAccountStatus, // Changed back to activeAccountStatus
}: SearchFilterSectionProps) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Search Input */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search {roleName}s
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={`Search by name or email...`}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
            />
          </div>
        </div>

        {/* Account Status Dropdown */}
        <div className="sm:w-48">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Status
          </label>
          <select
            value={accountStatus}
            onChange={(e) => onAccountStatusChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:flex-col">
          <button
            onClick={onSearch}
            disabled={loading || !hasRole}
            className="inline-flex items-center justify-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearSearch}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Search Info */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Active filters:</span>
          {activeSearchTerm && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Search: "{activeSearchTerm}"
            </span>
          )}
          {activeAccountStatus && activeAccountStatus !== "all" && (
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Status: {activeAccountStatus === "active" ? "Active" : "Inactive"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
