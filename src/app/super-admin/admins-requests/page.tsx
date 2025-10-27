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
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAdmins,
  approveAdmin,
  rejectAdmin,
  selectAdmins,
  selectTotalCount,
  selectCurrentPage,
  selectTotalPages,
  selectLoading,
  selectError,
  selectActionLoading,
  selectVerifiedCount,
  selectRejectedCount,
} from "@/store/slices/adminslice/adminSlice";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux selectors - get data from store
  const admins = useAppSelector(selectAdmins);
  const totalCount = useAppSelector(selectTotalCount);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const actionLoading = useAppSelector(selectActionLoading);
  const verifiedCount = useAppSelector(selectVerifiedCount);
  const rejectedCount = useAppSelector(selectRejectedCount);

  // Fetch admins on component mount
  useEffect(() => {
    dispatch(fetchAdmins(1));
  }, [dispatch]);

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(fetchAdmins(page));
  };

  // Handle approve action
  const handleApprove = async (adminId: string) => {
    if (
      !confirm(
        "Are you sure you want to approve this admin? They will receive access to create courses and manage students.",
      )
    ) {
      return;
    }

    try {
      const result = await dispatch(approveAdmin(adminId)).unwrap();
      alert(`✅ ${result.message}`);
      dispatch(fetchAdmins(currentPage));
    } catch (err: any) {
      alert(`❌ ${err}`);
    }
  };

  // Handle reject action
  const handleReject = async (adminId: string) => {
    if (!confirm("Are you sure you want to reject this admin application?")) {
      return;
    }

    try {
      const result = await dispatch(rejectAdmin(adminId)).unwrap();
      alert(`✅ ${result.message}`);
      dispatch(fetchAdmins(currentPage));
    } catch (err: any) {
      if (err === "Session expired. Please login again.") {
        alert("❌ Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        alert(`❌ ${err}`);
      }
    }
  };

  // Handle view admin details
  const handleViewDetails = (admin: any) => {
    router.push(`/super-admin/admin-details/?id=${admin}`);
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: '2-digit',
      // minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading admin users...
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
              Error Loading Admins
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => dispatch(fetchAdmins(currentPage))}
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
        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              <Shield className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
              Admin Users Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-white">
              View and manage all administrator accounts
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAdmins(currentPage))}
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] hover:bg-blue-700 dark:bg-[#43bf79]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Admins */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Total Admins
                </p>
                <p className="mt-1 text-3xl font-bold text-[#02517b] dark:text-[#43bf79]">
                  {totalCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02517b]/10 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <Shield className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Verified */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Verified
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-[#43bf79]">
                  {verifiedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Rejected
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {rejectedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-500/20">
                <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Admin Details
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
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <User className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="font-medium text-gray-500 dark:text-white">
                        No admin users found
                      </p>
                      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        Admin accounts will appear here once created
                      </p>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin: any, index: number) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {admin.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                src={admin.profileImage}
                                alt={admin.username}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 dark:border-blue-400">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {admin.username}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                ID: {admin.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                          <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-white" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          switch (admin.status) {
                            case "rejected":
                              return (
                                <div className="group relative inline-block">
                                  <span className="inline-flex cursor-help items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                                    <XCircle className="mr-1.5 h-4 w-4" />
                                    Approval Rejected
                                  </span>
                                  <div className="absolute bottom-full left-0 z-10 mb-2 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block dark:bg-gray-800">
                                    <div className="flex items-start gap-2">
                                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                      <div>
                                        <p className="mb-1 font-semibold">
                                          Rejected Admin
                                        </p>
                                        {/* <p className="text-gray-300">This admin application has been rejected and cannot access admin features.</p> */}
                                      </div>
                                    </div>
                                    <div className="absolute left-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                  </div>
                                </div>
                              );
                            case "pending":
                              return (
                                <div className="group relative inline-block">
                                  <span className="inline-flex cursor-help items-center rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400">
                                    <RefreshCw className="mr-1.5 h-4 w-4" />
                                    Waiting for Approval
                                  </span>
                                  <div className="absolute bottom-full left-0 z-10 mb-2 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block dark:bg-gray-800">
                                    <div className="flex items-start gap-2">
                                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                      <div>
                                        <p className="mb-1 font-semibold">
                                          Pending Approval
                                        </p>
                                        {/* <p className="text-gray-300">This admin is waiting for approval. Use the action buttons to approve or reject.</p> */}
                                      </div>
                                    </div>
                                    <div className="absolute left-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                  </div>
                                </div>
                              );
                            case "approved":
                              return (
                                <div className="group relative inline-block">
                                  <span className="inline-flex cursor-help items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                                    <CheckCircle className="mr-1.5 h-4 w-4" />
                                    Approved
                                  </span>
                                  <div className="absolute bottom-full left-0 z-10 mb-2 hidden w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg group-hover:block dark:bg-gray-800">
                                    <div className="flex items-start gap-2">
                                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                      <div>
                                        <p className="mb-1 font-semibold">
                                          Approved Admin
                                        </p>
                                        {/* <p className="text-gray-300">This admin has been approved and has full access. Click "View Details" to see more information.</p> */}
                                      </div>
                                    </div>
                                    <div className="absolute left-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                  </div>
                                </div>
                              );
                            default:
                              return (
                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                                  <Shield className="mr-1.5 h-4 w-4" />
                                  Admin
                                </span>
                              );
                          }
                        })()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(admin.createdAt)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          switch (admin.status) {
                            case "rejected":
                              return (
                                <p className="text-sm italic text-gray-500 dark:text-white">
                                  This admin is rejected
                                </p>
                              );
                            case "pending":
                              return (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(admin.id)}
                                    disabled={actionLoading[admin.id]}
                                    className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {actionLoading[admin.id] ? (
                                      <>
                                        <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="mr-1 h-3.5 w-3.5" />
                                        Approve
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(admin.id)}
                                    disabled={actionLoading[admin.id]}
                                    className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {actionLoading[admin.id] ? (
                                      <>
                                        <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <X className="mr-1 h-3.5 w-3.5" />
                                        Reject
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            case "approved":
                              return (
                                <button
                                  onClick={() => handleViewDetails(admin.id)}
                                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                >
                                  <Eye className="mr-1 h-3.5 w-3.5" />
                                  View Details
                                </button>
                              );
                            default:
                              return (
                                <p className="text-sm text-gray-500 dark:text-white">
                                  Unknown status
                                </p>
                              );
                          }
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="block items-center justify-between gap-4 sm:flex">
              {/* Page Info */}
              <div className="mb-3 text-center text-sm text-gray-600 dark:text-white sm:mb-0 sm:text-left">
                Page{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalPages}
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  <span className="xs:inline hidden">Previous</span>
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

                {/* Next Button */}
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

        {/* Footer Summary */}
        {admins.length > 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex flex-col items-center justify-between gap-5 text-sm sm:flex-row">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="font-semibold text-gray-600 dark:text-white">
                    Total:{" "}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalCount}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-white">
                    Verified:{" "}
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-500">
                    {verifiedCount}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-white">
                    Rejected:{" "}
                  </span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-500">
                    {rejectedCount}
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-white">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
