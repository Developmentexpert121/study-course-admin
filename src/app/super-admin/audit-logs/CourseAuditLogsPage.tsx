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
  CalendarDays,
  Clock,
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
    // Fetch with limit of 5
    dispatch(fetchCourseAuditLogs({ ...filters, limit: 5 }));
    if (showStats) {
      // dispatch(fetchAuditLogStats());
    }
  }, [dispatch, filters, showStats]);

  const handleApplyFilters = () => {
    const filtersToApply: AuditLogFilters = {
      page: 1,
      limit: 5, // Changed to 5
      sort: '-action_timestamp',
    };

    if (localFilters.search) filtersToApply.search = localFilters.search;
    if (localFilters.is_active_status)
      filtersToApply.is_active_status = localFilters.is_active_status === 'true';

    dispatch(setFilters(filtersToApply));
    dispatch(fetchCourseAuditLogs(filtersToApply));
    setShowFilters(false);
  };

  // Filter audit logs by course name and limit to 5
  const filteredAuditLogs = localFilters.course_name
    ? auditLogs
      .filter((log) =>
        log.course_title.toLowerCase().includes(localFilters.course_name.toLowerCase())
      )
      .slice(0, 5)
    : auditLogs.slice(0, 5);

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      course_name: '',
      is_active_status: '',
    });
    dispatch(clearFilters());
    dispatch(fetchCourseAuditLogs({ page: 1, limit: 5, sort: '-action_timestamp' }));
  };

  const handleRefresh = () => {
    dispatch(fetchCourseAuditLogs({ ...filters, limit: 5 }));
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

  // Mock stats data
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
    <div className=" ">
      <div className=" mx-auto">
        {/* Header */}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-xl">
            <p className="text-red-800 dark:text-red-400 font-medium">
              {error.code} {error.message ? `: ${error.message}` : ''}
            </p>
          </div>
        )}



        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Latest 5 Course Audit Logs
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredAuditLogs.length > 0 ? (
              <div className="p-4 space-y-3">
                {filteredAuditLogs.map((log: any, index: number) => {
                  const actionColor = getActionColor(log.action);
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetails(true);
                      }}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/60 dark:to-gray-900/30 p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#02517b] dark:bg-blue-900/40 p-2">
                          <BookOpen className="h-5 w-5 text-white dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            {log.course_title}
                          </h3>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                            {log.user_name ? (
                              <span>
                                <User className="inline w-3 h-3 mr-1 text-gray-400" />
                                {log.user_name}
                              </span>
                            ) : (
                              <span>System</span>
                            )}
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3 text-gray-400" />
                              {format(new Date(log.action_timestamp), "PPP")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {format(new Date(log.action_timestamp), "p")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`mt-5 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-max  border capitalize ${actionColor.bg} ${actionColor.text} ${actionColor.border}`}
                      >
                        {log.action}
                      </span>
                    </div>
                  );
                })}
              </div>

            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No course audit logs found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
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