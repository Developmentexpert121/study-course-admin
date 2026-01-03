"use client";

import React, { useEffect, useState } from "react";
import {
  Book,
  User,
  Mail,
  Calendar,
  Eye,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  BarChart3,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserCourses,
  fetchUserCourseStats,
  selectUserCourses,
  selectTotalCourses,
  selectCurrentPage,
  selectTotalPages,
  selectLoading,
  selectError,
  selectCourseStats,
} from "@/store/slices/adminslice/userCourseSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserCoursesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux selectors - get data from store
  const courses = useAppSelector(selectUserCourses);
  const totalCourses = useAppSelector(selectTotalCourses);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const stats = useAppSelector(selectCourseStats);

  // Local state for filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "active",
  });
  const searchParams = useSearchParams();

  const userId = searchParams.get("id");

  useEffect(() => {
    if (userId) {
      const numericUserId = parseInt(userId);
      if (!isNaN(numericUserId)) {
        dispatch(fetchUserCourseStats(numericUserId));
      }
    }
  }, [dispatch, userId]);

  const handleViewCourse = (courseId: any) => {
    router.push(`/super-admin/admin-details/course-details?id=${courseId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (userId) {
      const numericUserId = parseInt(userId);
      if (!isNaN(numericUserId)) {
        dispatch(
          fetchUserCourses({
            userId: numericUserId,
            page: currentPage,
            filters,
          }),
        );
        dispatch(fetchUserCourseStats(numericUserId));
      }
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading courses...
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
            <Book className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
              Error Loading Courses
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleRefresh}
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <Book className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-500" />
              Teacher Courses Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and manage all courses created by this user
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {(stats as any)?.data?.courses?.length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Courses
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-500">
                  {(stats as any)?.data?.filters?.totalActive || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Inactive Courses
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                  {(stats as any)?.data?.filters?.totalInactive || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/20">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Rating
                </p>
                <p className="mt-1 text-3xl font-bold text-purple-600 dark:text-purple-500">
                  {(stats as any)?.averageRating || "0.0"}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}

        {/* Rest of your component remains the same... */}
        {/* (Courses Table, Pagination, etc.) */}

        {/* Courses Table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Courses ({(stats as any)?.data?.courses?.length || 0})
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Course Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!(stats as any)?.data?.courses ||
                (stats as any).data.courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <Book className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                      <p className="font-medium text-gray-500 dark:text-gray-400">
                        No courses found
                      </p>
                      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        {filters.search ||
                        filters.category ||
                        filters.status !== "active"
                          ? "Try adjusting your filters"
                          : "This Teacher has not created any courses yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  (stats as any).data.courses.map(
                    (course: any, index: number) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        {/* Course Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="h-12 w-16 flex-shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600">
                                <Book className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                {course.title}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                {course.description ||
                                  "No description available"}
                              </p>
                              <div className="mt-1 flex items-center text-xs text-gray-400 dark:text-gray-500">
                                <User className="mr-1 h-3 w-3" />
                                <span>
                                  {course.instructorName ||
                                    "Unknown Instructor"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                            {course.category || "Uncategorized"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              course.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300"
                            }`}
                          >
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(course.createdAt)}
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                              ({course.totalReviews || 0})
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() =>
                              router.push(
                                `/super-admin/chapters?course=${course.title}&course_id=${course.id}`,
                              )
                            }
                            className="inline-flex items-center rounded-lg border border-transparent bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Loading State for Table */}
          {loading &&
            (stats as any)?.data?.courses &&
            (stats as any).data.courses.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Updating...
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Note: Since all courses are in stats.data.courses, pagination might not be needed */}
        {/* But if you want to implement client-side pagination, you can add it here */}
        {(stats as any)?.data?.courses &&
          (stats as any).data.courses.length > 10 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Showing all {(stats as any).data.courses.length} courses
                {/* You can implement client-side pagination here if needed */}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
