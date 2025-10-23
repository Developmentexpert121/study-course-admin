'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdminActivities } from '@/store/slices/adminslice/adminActivitySlice';
import { RootState, AppDispatch } from '@/store';

// Import icons
import { 
  Calendar, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  RefreshCw,
  Clock,
  ChevronLeft, 
  ChevronRight,
  Shield,
  User,
  Search,
  LogIn,
  LogOut
} from 'lucide-react';

export default function AdminActivitiesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading, error, totalCount, currentPage, totalPages, hasMore } = useSelector(
    (state: RootState) => state.adminActivity
  );


  const [filters, setFilters] = useState({
    activity_type: '',
    admin_id: ''
  });


// In your component, make sure you're using the correct API endpoint
useEffect(() => {
  dispatch(getAllAdminActivities({ page: 1, limit: 20 }));
}, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(getAllAdminActivities({ 
      page, 
      limit: 20,
      activity_type: filters.activity_type || undefined,
      admin_id: filters.admin_id ? parseInt(filters.admin_id) : undefined
    }));
  };

  // Handle filter changes

  // Apply filters
  const applyFilters = () => {
    dispatch(getAllAdminActivities({ 
      page: 1, 
      limit: 20,
      activity_type: filters.activity_type || undefined,
      admin_id: filters.admin_id ? parseInt(filters.admin_id) : undefined
    }));
  };

  // Format date
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

  // Calculate stats based on your actual data
  const getStats = () => {
    const totalLogins = activities.filter(a => a.activity_type === 'login').length;
    const totalLogouts = activities.filter(a => a.activity_type === 'logout').length;
    
    // Since we don't have session duration in your model, we'll show basic stats
    return { totalLogins, totalLogouts, totalActivities: totalCount };
  };

  const stats = getStats();

  // Loading state
  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="dark:text-gray-300 text-gray-600 font-medium">Loading admin activities...</p>
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
            <div className="h-12 w-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Activities</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => dispatch(getAllAdminActivities({ page: 1, limit: 20 }))}
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
              Admin Activities
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor all admin login and logout activities</p>
          </div>
          <button
            onClick={() => dispatch(getAllAdminActivities({ page: currentPage, limit: 20 }))}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards - Simplified for your data structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Activities</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500 mt-1">{stats.totalActivities}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Logins</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">{stats.totalLogins}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <LogIn className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Logouts</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-500 mt-1">{stats.totalLogouts}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
      

        {/* Activities Table - Simplified for your data structure */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Activity Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Admin ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No activities found</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Admin activities will appear here once they login or logout</p>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center border-2 border-blue-300 dark:border-blue-400">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {activity.username || `Admin ${activity.admin_id}`}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          activity.activity_type === 'login' 
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                            : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                        }`}>
                          {activity.activity_type === 'login' ? (
                            <>
                              <LogIn className="h-3.5 w-3.5 mr-1.5" />
                              LOGIN
                            </>
                          ) : (
                            <>
                              <LogOut className="h-3.5 w-3.5 mr-1.5" />
                              LOGOUT
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(activity.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{activity.admin_id}
                        </div>
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
                {' '}({totalCount} total activities)
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
      </div>
    </div>
  );
}