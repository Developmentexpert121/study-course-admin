"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  Search,
  Download,
  AlertCircle,
  AlertTriangle,
  Check,
  X as CloseIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAllCertificates,
  selectCertificates,
  selectLoading,
  selectError,
  selectCount,
} from "@/store/slices/adminslice/certificate";

import {
  approveCertificate,
  rejectCertificate,
} from "@/store/slices/adminslice/approvalcertificate";

import { getDecryptedItem } from "@/utils/storageHelper";

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'approve' | 'reject';
  loading?: boolean;
  showReasonInput?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'approve',
  loading = false,
  showReasonInput = false,
  reason = '',
  onReasonChange,
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    return type === 'approve' 
      ? 'bg-green-100 dark:bg-green-900/30' 
      : 'bg-red-100 dark:bg-red-900/30';
  };

  const getIconElement = () => {
    return type === 'approve' 
      ? <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      : <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />;
  };

  const getButtonColor = () => {
    return type === 'approve'
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-red-600 hover:bg-red-700';
  };

  const isConfirmDisabled = loading || (showReasonInput && !reason?.trim());

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

          {/* Reason Input for Rejection */}
          {showReasonInput && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Rejection
              </label>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange?.(e.target.value)}
                placeholder="Please provide a reason for rejecting this certificate..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-400/20"
                rows={3}
              />
            </div>
          )}
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
            disabled={isConfirmDisabled}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${getButtonColor()}`}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {type === 'approve' ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <CloseIcon className="mr-2 h-4 w-4" />
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

export default function CertificatesPage() {
  const dispatch = useAppDispatch();

  const role: any = getDecryptedItem("role");

  // Redux selectors
  const certificates = useAppSelector(selectCertificates);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const count = useAppSelector(selectCount);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    certificateId: string | null;
  }>({
    isOpen: false,
    type: 'approve',
    certificateId: null
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalLoading, setApprovalLoading] = useState<Record<string, boolean>>({});
  const [rejectionLoading, setRejectionLoading] = useState<Record<string, boolean>>({});

  // Local state for search and filters
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"username" | "email">("username");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch certificates on component mount
  useEffect(() => {
    dispatch(fetchAllCertificates());
  }, [dispatch]);

  // Filter certificates based on search and status
  const filteredCertificates = certificates.filter((cert: any) => {
    const matchesSearch =
      searchType === "username"
        ? cert.user.name.toLowerCase().includes(localSearchTerm.toLowerCase())
        : cert.user.email.toLowerCase().includes(localSearchTerm.toLowerCase());

    const matchesStatus = !statusFilter || cert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedCertificates = filteredCertificates.slice(startIdx, endIdx);

  // Modal handlers
  const openApproveModal = (certificateId: string) => {
    setModalState({
      isOpen: true,
      type: 'approve',
      certificateId
    });
  };

  const openRejectModal = (certificateId: string) => {
    setRejectionReason('');
    setModalState({
      isOpen: true,
      type: 'reject',
      certificateId
    });
  };

  const closeModal = () => {
    if (!approvalLoading[modalState.certificateId || ''] && !rejectionLoading[modalState.certificateId || '']) {
      setModalState({
        isOpen: false,
        type: 'approve',
        certificateId: null
      });
      setRejectionReason('');
    }
  };

  // Handle approve action
  const handleApprove = async () => {
    if (!modalState.certificateId) return;

    setApprovalLoading(prev => ({ ...prev, [modalState.certificateId!]: true }));
    try {
      const res = await dispatch(approveCertificate(modalState.certificateId));
      if (approveCertificate.fulfilled.match(res)) {
        dispatch(fetchAllCertificates());
      }
    } catch (error) {
      console.error("Error approving certificate:", error);
    } finally {
      setApprovalLoading(prev => ({ ...prev, [modalState.certificateId!]: false }));
      closeModal();
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!modalState.certificateId || !rejectionReason.trim()) return;

    setRejectionLoading(prev => ({ ...prev, [modalState.certificateId!]: true }));
    try {
      const res = await dispatch(rejectCertificate({
        Id: modalState.certificateId,
        reason: rejectionReason.trim(),
        role
      }));

      if (rejectCertificate.fulfilled.match(res)) {
        dispatch(fetchAllCertificates());
      }
    } catch (error) {
      console.error("Error rejecting certificate:", error);
    } finally {
      setRejectionLoading(prev => ({ ...prev, [modalState.certificateId!]: false }));
      closeModal();
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setStatusFilter("");
    setSearchType("username");
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
      case "teacher_approved":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
      case "teacher_rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
      case "admin_approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
      case "admin_rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
      case "revoked":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "issued":
        return "Issued";
      case "pending":
        return "Pending";
      case "teacher_approved":
        return "Teacher Approved";
      case "teacher_rejected":
        return "Teacher Rejected";
      case "admin_approved":
        return "Admin Approved";
      case "admin_rejected":
        return "Admin Rejected";
      case "revoked":
        return "Revoked";
      default:
        return status;
    }
  };

  // Check if any filters are active
  const hasActiveFilters = localSearchTerm || statusFilter;

  // Loading state
  if (loading && certificates.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading certificates...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && certificates.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-500/50 dark:bg-red-900/20">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
              Error Loading Certificates
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => dispatch(fetchAllCertificates())}
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
          onConfirm={modalState.type === 'approve' ? handleApprove : handleReject}
          title={modalState.type === 'approve' ? 'Approve Certificate' : 'Reject Certificate'}
          message={
            modalState.type === 'approve'
              ? 'Are you sure you want to approve this certificate? The certificate will be issued to the student.'
              : 'Are you sure you want to reject this certificate? The student will be notified of the rejection.'
          }
          confirmText={modalState.type === 'approve' ? 'Approve' : 'Reject'}
          cancelText="Cancel"
          type={modalState.type}
          loading={modalState.type === 'approve' 
            ? approvalLoading[modalState.certificateId || ''] 
            : rejectionLoading[modalState.certificateId || '']}
          showReasonInput={modalState.type === 'reject'}
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
        />

        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              <FileText className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
              Certificates Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-white">
              View and manage all issued certificates
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAllCertificates())}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79]"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Search Type Selector */}
            <div className="sm:w-40">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search By
              </label>
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as "username" | "email");
                  setLocalSearchTerm("");
                }}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
              >
                <option value="username">User Name</option>
                <option value="email">Email</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {searchType === "username"
                  ? "Search by Username"
                  : "Search by Email"}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    searchType === "username"
                      ? "Search by name..."
                      : "Search by email..."
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certificate Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="teacher_approved">Teacher Approved</option>
                <option value="teacher_rejected">Teacher Rejected</option>
                <option value="admin_approved">Admin Approved</option>
                <option value="admin_rejected">Admin Rejected</option>
                <option value="issued">Issued</option>
                <option value="revoked">Revoked</option>
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

              {(localSearchTerm || statusFilter) && (
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

          {/* Active Filters Info */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Active filters:</span>
              {localSearchTerm && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {searchType === "username" ? "User" : "Email"}: "{localSearchTerm}"
                </span>
              )}
              {statusFilter && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Status: {getStatusLabel(statusFilter)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Certificates */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Total Certificates
                </p>
                <p className="mt-1 text-3xl font-bold text-[#02517b] dark:text-[#43bf79]">
                  {count}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02517b]/10 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <FileText className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Issued */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Issued
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-[#43bf79]">
                  {certificates.filter((c: any) => c.status === "issued").length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Pending
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {
                    certificates.filter((c: any) => c.status === "pending")
                      .length
                  }
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-500/20">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
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
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Certificate Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Issued Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {paginatedCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="font-medium text-gray-500 dark:text-white">
                          {hasActiveFilters
                            ? "No certificates match your search"
                            : "No certificates found"}
                        </p>
                        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                          {hasActiveFilters
                            ? "Try adjusting your search or filters"
                            : "Certificates will appear here once created"}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={handleClearSearch}
                            className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                          >
                            Clear Filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedCertificates.map((cert: any, index: number) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        {/* User Details */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              {cert.user.profileImage ? (
                                <img
                                  className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                  src={cert.user.profileImage}
                                  alt={cert.user.name}
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 dark:border-blue-400">
                                  <User className="h-6 w-6 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {cert.user.name}
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">
                                  {cert.user.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Course */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {cert.course.name}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {cert.course.category}
                          </div>
                        </td>

                        {/* Certificate Code */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                            {cert.certificate_code.substring(0, 12)}...
                          </div>
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusColor(cert.status)}`}
                          >
                            {getStatusLabel(cert.status)}
                          </span>
                        </td>

                        {/* Issued Date */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-white">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>{formatDate(cert.issued_date)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {(() => {
                            switch (cert.status) {
                              case "pending":
                                return(
                                   <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => openApproveModal(cert.id)}
                                      disabled={approvalLoading[cert.id] || loading}
                                      className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {approvalLoading[cert.id] ? (
                                        <>
                                          <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          Approving...
                                        </>
                                      ) : (
                                        "Approve"
                                      )}
                                    </button>
                                    <button
                                      onClick={() => openRejectModal(cert.id)}
                                      disabled={rejectionLoading[cert.id] || loading}
                                      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {rejectionLoading[cert.id] ? (
                                        <>
                                          <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          Rejecting...
                                        </>
                                      ) : (
                                        "Reject"
                                      )}
                                    </button>
                                  </div>
                                );
                              case "admin_approved":
                              case "wait for super-admin approval":
                                return( <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
      Waiting for Super Admin Approval
    </span>);
                              case "wait for admin approval":
                                return (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => openApproveModal(cert.id)}
                                      disabled={approvalLoading[cert.id] || loading}
                                      className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {approvalLoading[cert.id] ? (
                                        <>
                                          <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          Approving...
                                        </>
                                      ) : (
                                        "Approve"
                                      )}
                                    </button>
                                    <button
                                      onClick={() => openRejectModal(cert.id)}
                                      disabled={rejectionLoading[cert.id] || loading}
                                      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {rejectionLoading[cert.id] ? (
                                        <>
                                          <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          Rejecting...
                                        </>
                                      ) : (
                                        "Reject"
                                      )}
                                    </button>
                                  </div>
                                );
                              case "issued":
                                return (
                                  <button className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                                    Issued
                                  </button>
                                );
                              case "admin_rejected":
                                return (
                                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    Rejected
                                  </span>
                                );
                              case "super-admin_approved":
                                return (
                                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    Super Admin Approved
                                  </span>
                                );
                              case "super-admin_rejected":
                                return (
                                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    Super Admin Rejected
                                  </span>
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
                {hasActiveFilters && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    (Filtered results)
                  </span>
                )}
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
                          className={`rounded-lg px-3 py-2 text-sm shadow-sm transition-all duration-200 ${currentPage === page
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="hidden xs:inline">Next</span>
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