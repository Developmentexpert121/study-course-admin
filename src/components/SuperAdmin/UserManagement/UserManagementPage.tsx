"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUsers,
  setPage,
  setSearch,
  setVerificationStatus,
  setRoleId,
} from "../../../store/slices/adminslice/all-user-details";
import {
  activateUser,
  deactivateUser,
} from "../../../store/slices/adminslice/userManagement";
import { useApiClient } from "@/lib/api";
import UserManagementHeader from "./UserManagementHeader";
import SearchFilterSection from "./SearchFilterSection";
import StatsCards from "./StatsCards";
import UsersTable from "./UsersTable";
import PaginationControls from "./PaginationControls";
import CreateUserModal from "./CreateUserModal";

interface UserManagementPageProps {
  className?: string;
  roleName: "Student" | "Teacher" | "Admin";
  icon: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
}

export default function UserManagementPage({
  className,
  roleName,
  icon,
  pageTitle,
  pageDescription,
}: UserManagementPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const api = useApiClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<any>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]); // For Admin page role selection
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null); // For Admin page
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localVerificationStatus, setLocalVerificationStatus] = useState("all");

  const {
    users,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    verificationStatus,
    totalUsers,
    activeUsers,
  } = useAppSelector((state) => state.users);

  const limit = 5;

  // Define excluded roles for Admin page
  const EXCLUDED_ROLES = ["Super-Admin", "Student", "Teacher"];

  // Fetch roles with filtering for Admin role
  // Fetch roles with filtering for Admin role
  const fetchRoles = async () => {
    try {
      console.log("Fetching roles...");
      const response = await api.get("roles");
      console.log("Roles API Response:", response);

      if (response.success) {
        console.log("All roles:", response.data.data);

        // In the fetchRoles function, update the Admin section:
        if (roleName === "Admin") {
          // For Admin page, get all roles except excluded ones
          const filteredRoles = response.data.data.filter(
            (role: any) => !EXCLUDED_ROLES.includes(role.name),
          );
          console.log("Filtered roles for Admin:", filteredRoles);

          setAvailableRoles(filteredRoles);

          // Set the first available role as default selection
          if (filteredRoles.length > 0) {
            const defaultRoleId = selectedRoleId || filteredRoles[0].id;
            setSelectedRoleId(defaultRoleId);
            const defaultRole =
              filteredRoles.find((role: any) => role.id === defaultRoleId) ||
              filteredRoles[0];
            setUserRole(defaultRole);
            dispatch(setRoleId(defaultRoleId));
            console.log("Default role set to:", defaultRole);
          } else {
            console.log("No roles available for Admin page");
          }
        } else {
          // For Student and Teacher, get the specific role
          const role = response.data.data.find(
            (role: any) => role.name === roleName,
          );
          console.log(`Found ${roleName} role:`, role);
          setUserRole(role);
          if (role) {
            dispatch(setRoleId(role.id));
          }
        }
      }
    } catch (error) {
      console.error(`Failed to fetch roles:`, error);
    }
  };

  // Calculate stats
  const totalCount = totalUsers || 0;
  const activeCount = activeUsers || 0;
  const inactiveCount = totalCount - activeUsers || 0;

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle role selection change for Admin page
  const handleRoleChange = (roleId: string) => {
    console.log("=== ROLE CHANGE IN PARENT ===");
    console.log("New roleId:", roleId);
    console.log("Available roles:", availableRoles);

    if (!roleId) {
      console.error("No roleId provided");
      return;
    }

    const selectedRole = availableRoles.find((role) => role.id === roleId);
    console.log("Found role:", selectedRole);

    if (selectedRole) {
      setSelectedRoleId(roleId);
      setUserRole(selectedRole);
      dispatch(setRoleId(roleId));
      dispatch(setPage(1)); // Reset to first page when role changes

      // Force refresh users with new role
      dispatch(
        fetchUsers({
          page: 1, // Always start from page 1 when role changes
          limit,
          search: searchTerm,
          verificationStatus,
          role_id: roleId,
        }),
      );
    } else {
      console.error("Role not found in availableRoles");
    }
  };

  // Fetch users when dependencies change
  useEffect(() => {
    if (roleName === "Admin" ? selectedRoleId : userRole) {
      dispatch(
        fetchUsers({
          page: currentPage,
          limit,
          search: searchTerm,
          verificationStatus,
          role_id: roleName === "Admin" ? selectedRoleId : userRole?.id,
        }),
      );
      setIsInitialLoad(false);
    }
  }, [
    dispatch,
    currentPage,
    limit,
    searchTerm,
    verificationStatus,
    userRole,
    selectedRoleId,
    roleName,
  ]);

  // Handlers
  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleSearch = () => {
    dispatch(setPage(1));
    dispatch(setSearch(localSearchTerm));
    dispatch(setVerificationStatus(localVerificationStatus));
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setLocalVerificationStatus("all");
    dispatch(setSearch(""));
    dispatch(setVerificationStatus("all"));
    dispatch(setPage(1));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeactivateUser = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to deactivate this user?`)) {
      setProcessingUserId(userId);
      try {
        const result = await dispatch(deactivateUser({ userId }));
        if (deactivateUser.fulfilled.match(result)) {
          refreshUsers();
        }
      } catch (error) {
        console.error(`Failed to deactivate user:`, error);
      } finally {
        setProcessingUserId(null);
      }
    }
  };

  const handleActivateUser = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to activate this user?`)) {
      setProcessingUserId(userId);
      try {
        const result = await dispatch(activateUser({ userId }));
        if (activateUser.fulfilled.match(result)) {
          refreshUsers();
        }
      } catch (error) {
        console.error(`Failed to activate user:`, error);
      } finally {
        setProcessingUserId(null);
      }
    }
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/super-admin/admins/view-details?id=${userId}`);
  };

  const handleUserCreated = () => {
    refreshUsers();
  };

  const refreshUsers = () => {
    if (roleName === "Admin" ? selectedRoleId : userRole) {
      dispatch(
        fetchUsers({
          page: currentPage,
          limit,
          search: searchTerm,
          verificationStatus,
          role_id: roleName === "Admin" ? selectedRoleId : userRole?.id,
        }),
      );
    }
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading state only on initial load
  if (isInitialLoad && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading {roleName.toLowerCase()}s...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-500/50 dark:bg-red-900/20">
            <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={refreshUsers}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <UserManagementHeader
          icon={icon}
          title={pageTitle}
          description={pageDescription}
          role={userRole}
          roleName={roleName}
          onRefresh={refreshUsers}
          loading={loading}
          onCreateUser={() => setIsCreateModalOpen(true)}
          // Make sure these are passed correctly:
          availableRoles={roleName === "Admin" ? availableRoles : []}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />
        {/* Search and Filter Section */}
        <SearchFilterSection
          searchTerm={localSearchTerm}
          onSearchTermChange={setLocalSearchTerm}
          verificationStatus={localVerificationStatus}
          onVerificationStatusChange={setLocalVerificationStatus}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onKeyPress={handleKeyPress}
          loading={loading}
          hasRole={roleName === "Admin" ? !!selectedRoleId : !!userRole}
          roleName={roleName}
          hasActiveFilters={!!searchTerm || verificationStatus !== "all"}
          activeSearchTerm={searchTerm}
          activeVerificationStatus={verificationStatus}
          // Pass additional props for Admin page
          availableRoles={roleName === "Admin" ? availableRoles : []}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />
        {/* Stats Cards */}
        <StatsCards
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          roleName={roleName}
          icon={icon}
        />
        {/* Users Table */}
        <UsersTable
          users={users}
          loading={loading}
          roleName={roleName}
          searchTerm={searchTerm}
          processingUserId={processingUserId}
          onDeactivateUser={handleDeactivateUser}
          onActivateUser={handleActivateUser}
          onViewDetails={handleViewDetails}
          onClearSearch={handleClearSearch}
          formatDate={formatDate}
          // Pass current role for display
          currentRole={userRole}
        />
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            searchTerm={searchTerm}
            onPageChange={handlePageChange}
          />
        )}
        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
          userRole={userRole}
          roleName={roleName}
          // Pass available roles for Admin page
          availableRoles={roleName === "Admin" ? availableRoles : []}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
}
