"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import {
  activateUser,
  deactivateUser,
} from "../../../store/slices/adminslice/userManagement";
import { setPage } from "../../../store/slices/adminslice/all-user-details";
import UserManagementHeader from "./UserManagementHeader";
import SearchFilterSection from "./SearchFilterSection";
import StatsCards from "./StatsCards";
import UsersTable from "./UsersTable";
import PaginationControls from "./PaginationControls";
import CreateUserModal from "./CreateUserModal";
import { useUserManagement } from "@/hooks/useUserManagement";

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

  // Use the custom hook - ADD localAccountStatus and setLocalAccountStatus
  const {
    // State
    isCreateModalOpen,
    setIsCreateModalOpen,
    userRole,
    availableRoles,
    selectedRoleId,
    isInitialLoad,
    processingUserId,
    setProcessingUserId,
    localSearchTerm,
    setLocalSearchTerm,
    localAccountStatus, // ADD THIS
    setLocalAccountStatus, // ADD THIS

    // Redux state
    usersState,

    // Memoized values
    totalCount,
    activeCount,
    inactiveCount,

    // Handlers
    handleRoleChange,
    handleSearch,
    handleClearSearch,
    handleKeyPress,
    refreshUsers,
  } = useUserManagement({ roleName });

  const {
    users,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    accountStatus,
  } = usersState; // ADD accountStatus here

  // Handlers that need dispatch
  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
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
    router.push(`/platform-manager/admins/view-details?id=${userId}`);
  };

  const handleUserCreated = () => {
    refreshUsers();
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
          availableRoles={roleName === "Admin" ? availableRoles : []}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />

        {/* Search and Filter Section */}
        <SearchFilterSection
          searchTerm={localSearchTerm}
          onSearchTermChange={setLocalSearchTerm}
          accountStatus={localAccountStatus} // Now this will work
          onAccountStatusChange={setLocalAccountStatus} // Now this will work
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onKeyPress={handleKeyPress}
          loading={loading}
          hasRole={roleName === "Admin" ? !!selectedRoleId : !!userRole}
          roleName={roleName}
          hasActiveFilters={!!searchTerm || accountStatus !== "all"} // Use accountStatus from destructured usersState
          activeSearchTerm={searchTerm}
          activeAccountStatus={accountStatus} // Use accountStatus from destructured usersState
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
          availableRoles={roleName === "Admin" ? availableRoles : []}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
}
