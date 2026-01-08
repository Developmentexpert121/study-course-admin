// app/(admin)/course-audit-logs/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchCourseAuditLogs,
  fetchAuditLogStats,
  setFilters,
  clearFilters,
  setPage,
  AuditLogFilters,
  AuditLog,
} from '@/store/slices/adminslice/auditcourselog';
import { format } from 'date-fns';

// Import icons
import {
  Calendar,
  RefreshCw,
  User,
  Activity,
  X,
  BookOpen,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function CourseAuditLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs, pagination, filters, loading, stats, statsLoading, error } = useSelector(
    (state: RootState) => state.courseAuditLogs
  );

  const [showStats, setShowStats] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    search: '',
    course_name: '',
    is_active_status: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseAuditLogs(filters));
    if (showStats) {
      // dispatch(fetchAuditLogStats());
    }
  }, [dispatch, filters, showStats]);

  const handleApplyFilters = () => {
    const filtersToApply: AuditLogFilters = {
      page: 1,
      limit: 20,
      sort: '-action_timestamp',
    };

    if (localFilters.search) filtersToApply.search = localFilters.search;
    if (localFilters.is_active_status)
      filtersToApply.is_active_status = localFilters.is_active_status === 'true';

    dispatch(setFilters(filtersToApply));
    dispatch(fetchCourseAuditLogs(filtersToApply));
    setShowFilters(false);
  };

  // Filter audit logs by course name (client-side filtering)
  const filteredAuditLogs = localFilters.course_name
    ? auditLogs.filter((log) =>
      log.course_title.toLowerCase().includes(localFilters.course_name.toLowerCase())
    )
    : auditLogs;

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      course_name: '',
      is_active_status: '',
    });
    dispatch(clearFilters());
    dispatch(fetchCourseAuditLogs({ page: 1, limit: 20, sort: '-action_timestamp' }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(fetchCourseAuditLogs({ ...filters, page: newPage }));
  };

  const handleRefresh = () => {
    dispatch(fetchCourseAuditLogs(filters));
    if (showStats) {
      // dispatch(fetchAuditLogStats());
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      created: {
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        text: 'text-blue-800 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-500/30'
      },
      updated: {
        bg: 'bg-gray-100 dark:bg-gray-500/20',
        text: 'text-gray-800 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-500/30'
      },
      activated: {
        bg: 'bg-green-100 dark:bg-green-500/20',
        text: 'text-green-800 dark:text-green-400',
        border: 'border-green-200 dark:border-green-500/30'
      },
      deactivated: {
        bg: 'bg-yellow-100 dark:bg-yellow-500/20',
        text: 'text-yellow-800 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-500/30'
      },
      deleted: {
        bg: 'bg-red-100 dark:bg-red-500/20',
        text: 'text-red-800 dark:text-red-400',
        border: 'border-red-200 dark:border-red-500/30'
      },
    };

    return colors[action] || {
      bg: 'bg-gray-100 dark:bg-gray-500/20',
      text: 'text-gray-800 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-500/30'
    };
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) {
      return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
    }
    return status
      ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-500/30'
      : 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const page = pagination.current_page;
    const totalPages = pagination.total_pages;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${i === page
            ? 'bg-[#02517b] text-white shadow-sm'
            : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    );
  };

  // Mock stats data - replace with actual API call
  const mockStats = {
    total_logs: pagination?.total_records || 0,
    recent_activity_24h: filteredAuditLogs.filter(log => {
      const logDate = new Date(log.action_timestamp);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return logDate > yesterday;
    }).length,
    actions_breakdown: Object.entries(
      filteredAuditLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([action, count]) => ({ action, count })),
    top_users: Object.entries(
      filteredAuditLogs.reduce((acc, log) => {
        if (log.user_name) {
          acc[log.user_name] = (acc[log.user_name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([user_name, action_count]) => ({ user_name, action_count }))
      .sort((a, b) => b.action_count - a.action_count)
      .slice(0, 3),
  };

  const displayStats = stats || mockStats;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-[#1A6A93] dark:text-blue-500" />
              Course Audit Logs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track all course-related activities and changes
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-[#02517b] text-white rounded-lg hover:bg-[#1A6A93] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-xl">
            <p className="text-red-800 dark:text-red-400 font-medium">
              {error.code} {error.message ? `: ${error.message}` : ''}
            </p>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            {localFilters.course_name !== "" && <button
              onClick={handleClearFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-blue-300 text-sm font-medium"
            >
              Clear Filters
            </button>}
          </div>

          <div className="flex  items-end gap-6 flex-wrap">

            <div className='flex-1'>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={localFilters.course_name}
                onChange={(e) => setLocalFilters({ ...localFilters, course_name: e.target.value })}
                placeholder="Filter by course name..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>


            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-[#02517b] text-white rounded-lg hover:bg-[#1A6A93] transition-colors shadow-sm font-medium"
              >
                Apply Filters
              </button>

            </div>
          </div>
        </div>

        {/* Stats Section */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Logs</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 mt-1">
                    {displayStats.total_logs}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Recent Activity (24h)</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                    {displayStats.recent_activity_24h}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Actions Breakdown</p>
                  <div className="mt-2 space-y-1">
                    {displayStats.actions_breakdown.map((item) => (
                      <div key={item.action} className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600 dark:text-gray-400">{item.action}:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Top Active User</p>
                  {displayStats.top_users[0] ? (
                    <div className="mt-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {displayStats.top_users[0].user_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {displayStats.top_users[0].action_count} actions
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No user data</p>
                  )}
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}




        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Course Audit Logs ({pagination?.total_records || 0} {pagination?.total_records === 1 ? 'entry' : 'entries'})
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredAuditLogs.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAuditLogs.map((log) => {
                    const actionColor = getActionColor(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            #{log.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.course_title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {log.course_id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${actionColor.bg} ${actionColor.text} ${actionColor.border}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {log.user_name ? (
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.user_name}</p>
                              {log.user_id && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {log.user_id}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">System</span>
                          )}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(log.is_active_status)}`}
                          >
                            {log.is_active_status === null
                              ? 'N/A'
                              : log.is_active_status
                                ? 'Active'
                                : 'Inactive'}
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {format(new Date(log.action_timestamp), 'PPP')}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {format(new Date(log.action_timestamp), 'p')}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setShowDetails(true);
                            }}
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-blue-300 text-sm font-medium transition-colorsinline-flex items-center rounded-lg bg-[#02517b] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1A6A93]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No course audit logs found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {renderPagination()}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Audit Log Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Log ID</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">#{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Course</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLog.course_title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">ID: {selectedLog.course_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Action</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Performed By</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedLog.user_name || 'System'}
                  </p>
                  {selectedLog.user_id && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      User ID: {selectedLog.user_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(new Date(selectedLog.action_timestamp), 'PPP p')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Status</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {selectedLog.is_active_status === null
                      ? 'N/A'
                      : selectedLog.is_active_status
                        ? 'Active'
                        : 'Inactive'}
                  </p>
                </div>
                {selectedLog.changed_fields && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Changed Fields</label>
                    <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm overflow-x-auto border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      {JSON.stringify(selectedLog.changed_fields, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}