import React from "react";
import { Plus, RefreshCw } from "lucide-react";

interface UserManagementHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  role: any;
  roleName: string;
  onRefresh: () => void;
  loading: boolean;
  onCreateUser: () => void;
  // New props for Admin page
  availableRoles?: any[];
  selectedRoleId?: string | null;
  onRoleChange?: (roleId: string) => void;
}

export default function UserManagementHeader({
  icon,
  title,
  description,
  role,
  roleName,
  onRefresh,
  loading,
  onCreateUser,
  availableRoles = [],
  selectedRoleId,
  onRoleChange,
}: UserManagementHeaderProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = e.target.value;
    console.log("Role changed to:", roleId);
    onRoleChange?.(roleId);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          {icon}
          {title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-white">{description}</p>

        {/* Role Selector for Admin Page */}
        {roleName === "Admin" && availableRoles.length > 0 && (
          <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Role Type:
            </label>
            <select
              value={selectedRoleId || availableRoles[0]?.id || ""}
              onChange={handleSelectChange}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
            >
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCreateUser}
          disabled={!role}
          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create {role?.name || "User"}
        </button>
        <button
          onClick={onRefresh}
          disabled={loading || !role}
          className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}
