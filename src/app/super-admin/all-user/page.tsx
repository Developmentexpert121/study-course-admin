"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Shield,
  RefreshCw,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  AlertTriangle,
  Info,
  X as CloseIcon,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUsers,
  setPage,
  setSearch,
  setVerificationStatus,
} from "../../../store/slices/adminslice/all-user-details";
import {
  activateUser,
  deactivateUser,
} from "../../../store/slices/adminslice/userManagement";

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'activate' | 'deactivate';
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'deactivate',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    return type === 'activate' 
      ? 'bg-green-100 dark:bg-green-900/30' 
      : 'bg-red-100 dark:bg-red-900/30';
  };

  const getIconElement = () => {
    return type === 'activate' 
      ? <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      : <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />;
  };

  const getButtonColor = () => {
    return type === 'activate'
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-red-600 hover:bg-red-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getIconColor()}`}>
              {getIconElement()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            disabled={loading}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${getButtonColor()}`}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {type === 'activate' ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UsersWithProgressPage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
    unverifiedUsers
  } = useAppSelector((state) => state.users);
  const limit = 5;
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localVerificationStatus, setLocalVerificationStatus] = useState(
    verificationStatus || "all",
  );

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'activate' | 'deactivate';
    userId: string | null;
  }>({
    isOpen: false,
    type: 'deactivate',
    userId: null
  });

  // Calculate stats
  const totalCount = totalUsers || 0;
  const activeCount = activeUsers || 0;
  const inactiveCount = totalCount - activeUsers || 0;

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        search: searchTerm,
        verificationStatus,
      }),
    );
  }, [dispatch, currentPage, limit, searchTerm, verificationStatus]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleVerificationStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLocalVerificationStatus(newStatus);
    dispatch(setPage(1));
    dispatch(setVerificationStatus(newStatus));
    dispatch(setSearch(localSearchTerm));
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setLocalVerificationStatus("all");
    dispatch(setSearch(""));
    dispatch(setVerificationStatus("all"));
    dispatch(setPage(1));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    dispatch(setPage(1));
    dispatch(setSearch(localSearchTerm));
    dispatch(setVerificationStatus(localVerificationStatus));
  };

  // Modal handlers
  const openDeactivateModal = (userId: string) => {
    setModalState({
      isOpen: true,
      type: 'deactivate',
      userId
    });
  };

  const openActivateModal = (userId: string) => {
    setModalState({
      isOpen: true,
      type: 'activate',
      userId
    });
  };

  const closeModal = () => {
    if (!processingUserId) {
      setModalState({
        isOpen: false,
        type: 'deactivate',
        userId: null
      });
    }
  };

  const handleDeactivateUser = async () => {
    if (!modalState.userId) return;

    setProcessingUserId(modalState.userId);
    try {
      const result = await dispatch(deactivateUser({ userId: modalState.userId }));
      if (deactivateUser.fulfilled.match(result)) {
        dispatch(
          fetchUsers({
            page: currentPage,
            limit,
            search: searchTerm,
            verificationStatus,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    } finally {
      setProcessingUserId(null);
      closeModal();
    }
  };

  const handleActivateUser = async () => {
    if (!modalState.userId) return;

    setProcessingUserId(modalState.userId);
    try {
      const result = await dispatch(activateUser({ userId: modalState.userId }));
      if (activateUser.fulfilled.match(result)) {
        dispatch(
          fetchUsers({
            page: currentPage,
            limit,
            search: searchTerm,
            verificationStatus,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to activate user:", error);
    } finally {
      setProcessingUserId(null);
      closeModal();
    }
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/super-admin/all-user/view-details?id=${userId}`);
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading && !users) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-500/50 dark:bg-red-900/20">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
              Error Loading Users
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchUsers({
                    page: currentPage,
                    limit,
                    search: searchTerm,
                    verificationStatus,
                  }),
                )
              }
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
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
        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={modalState.type === 'activate' ? handleActivateUser : handleDeactivateUser}
          title={modalState.type === 'activate' ? 'Activate Student' : 'Deactivate Student'}
          message={
            modalState.type === 'activate'
              ? 'Are you sure you want to activate this student? They will regain access to their courses and learning materials.'
              : 'Are you sure you want to deactivate this student? They will lose access to their courses and learning materials.'
          }
          confirmText={modalState.type === 'activate' ? 'Activate' : 'Deactivate'}
          cancelText="Cancel"
          type={modalState.type}
          loading={processingUserId === modalState.userId}
        />

        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              <Shield className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
              Student Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-white">
              View and manage all user accounts
            </p>
          </div>
          <button
            onClick={() =>
              dispatch(
                fetchUsers({
                  page: currentPage,
                  limit,
                  search: searchTerm,
                  verificationStatus,
                }),
              )
            }
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] dark:bg-[#43bf79]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Total Users */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Total Student
                </p>
                <p className="mt-1 text-3xl font-bold text-[#02517b] dark:text-[#43bf79]">
                  {totalCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02517b]/10 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <User className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Active Student
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-[#43bf79]">
                  {activeCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Unverified Users */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Unverified Student
                </p>
                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                  {unverifiedUsers}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 transition-transform duration-300 group-hover:scale-110 dark:bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Deactivate Users */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Deactivate Student
                </p>
                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                  {inactiveCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 transition-transform duration-300 group-hover:scale-110 dark:bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Search Input */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
                />
              </div>
            </div>

            {/* Verification Status Dropdown */}
            <div className="sm:w-48">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Status
              </label>
              <select
                value={localVerificationStatus}
                onChange={handleVerificationStatusChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
              >
                <option value="all">All Student</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-col">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </button>

              {(searchTerm || localVerificationStatus !== "all") && (
                <button
                  onClick={handleClearSearch}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active Search Info */}
          {(searchTerm || verificationStatus !== "all") && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Active filters:</span>
              {searchTerm && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Search: "{searchTerm}"
                </span>
              )}
              {verificationStatus !== "all" && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Status:{" "}
                  {verificationStatus === "verified"
                    ? "Verified"
                    : "Unverified"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Verification Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Account Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-gray-400" />
                      <p className="font-medium text-gray-500 dark:text-white">
                        Loading...
                      </p>
                    </td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map((user: any) => (
                    <tr
                      key={user.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {user.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                src={user.profileImage}
                                alt={user.username}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#b4c0c77a] bg-[#02517b] dark:border-blue-400">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                ID: {user.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                          <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-white" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.verifyUser ? (
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                            <CheckCircle className="mr-1.5 h-4 w-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                            <XCircle className="mr-1.5 h-4 w-4" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2 ">
                          {user.status === "active" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeactivateModal(user.id);
                              }}
                              disabled={processingUserId === user.id}
                              className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingUserId === user.id ? (
                                <>
                                  <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <UserX className="mr-1 h-3.5 w-3.5" />
                                  Deactivate
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openActivateModal(user.id);
                              }}
                              disabled={processingUserId === user.id}
                              className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingUserId === user.id ? (
                                <>
                                  <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-1 h-3.5 w-3.5" />
                                  Activate
                                </>
                              )}
                            </button>
                          )}

                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(user.id);
                              }}
                              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              View
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">No course enrolled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <User className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="font-medium text-gray-500 dark:text-white">
                        {searchTerm
                          ? "No users found matching your search"
                          : "No users found"}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="mt-2 text-sm text-[#02517b] hover:underline dark:text-[#43bf79]"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalUsers > 1 && (
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
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  <span className="xs:inline hidden">Previous</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis =
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span
                            key={page}
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
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`rounded-lg px-3 py-2 text-sm shadow-sm transition-all duration-200 ${
                            currentPage === page
                              ? "bg-[#02517b] font-semibold text-white dark:bg-[#43bf79] dark:text-gray-900"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="xs:inline hidden">Next</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}