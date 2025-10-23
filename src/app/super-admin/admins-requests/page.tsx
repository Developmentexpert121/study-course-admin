'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, User, Mail, Calendar, Shield, RefreshCw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
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
} from '@/store/slices/adminslice/adminSlice';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  
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
    if (!confirm('Are you sure you want to approve this admin? They will receive access to create courses and manage students.')) {
      return;
    }

    try {
      const result = await dispatch(approveAdmin(adminId)).unwrap();
      alert(`✅ ${result.message}`);
      // Refresh the current page after successful approval
      dispatch(fetchAdmins(currentPage));
    } catch (err: any) {
      alert(`❌ ${err}`);
    }
  };

  // Handle reject action
  const handleReject = async (adminId: string) => {
    if (!confirm('Are you sure you want to reject this admin application?')) {
      return;
    }

    try {
      const result = await dispatch(rejectAdmin(adminId)).unwrap();
      alert(`✅ ${result.message}`);
      // Refresh the current page after successful rejection
      dispatch(fetchAdmins(currentPage));
    } catch (err: any) {
      if (err === 'Session expired. Please login again.') {
        alert('❌ Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
      } else {
        alert(`❌ ${err}`);
      }
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="dark:text-gray-300 text-gray-600 font-medium">Loading admin users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Admins</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchAdmins(currentPage))}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
              Admin Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all administrator accounts</p>
          </div>
          <button
            onClick={() => dispatch(fetchAdmins(currentPage))}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalCount}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Verified</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">{verifiedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Admin Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Verification Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Account Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No admin users found</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Admin accounts will appear here once created</p>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {admin.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                src={admin.profileImage}
                                alt={admin.username}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center border-2 border-blue-300 dark:border-blue-400">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {admin.username}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1 gap-2">
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">ID: {admin.id}</span>
                              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-500/30">
                                {admin.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                          <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          switch (admin.status) {
                            case "rejected":
                              return (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Approval Rejected
                                </span>
                              );
                            case "pending":
                              return (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
                                  <RefreshCw className="h-4 w-4 mr-1.5" />
                                  Waiting for Approval
                                </span>
                              );
                            case "approved":
                              return (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                                  <CheckCircle className="h-4 w-4 mr-1.5" />
                                  Approved
                                </span>
                              );
                            default:
                              return (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                                  <Shield className="h-4 w-4 mr-1.5" />
                                  Admin
                                </span>
                              );
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(admin.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          switch (admin.status) {
                            case "rejected":
                              return (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  This admin is rejected
                                </p>
                              );
                            case "pending":
                              return (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(admin.id)}
                                    disabled={actionLoading[admin.id]}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {actionLoading[admin.id] ? (
                                      <>
                                        <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3.5 w-3.5 mr-1" />
                                        Approve
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(admin.id)}
                                    disabled={actionLoading[admin.id]}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {actionLoading[admin.id] ? (
                                      <>
                                        <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-3.5 w-3.5 mr-1" />
                                        Reject
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            case "approved":
                              return (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  This admin is approved
                                </p>
                              );
                            default:
                              return (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
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
          <div className="mt-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-gray-500 dark:text-gray-400">
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
                        className={`px-3 py-2 rounded-lg transition-colors shadow-sm ${
                          currentPage === page
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Summary */}
        {admins.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total: </span>
                  <span className="font-bold text-gray-900 dark:text-white">{totalCount}</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Verified: </span>
                  <span className="font-bold text-green-600 dark:text-green-500">{verifiedCount}</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Rejected: </span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-500">{rejectedCount}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}