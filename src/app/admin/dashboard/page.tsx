"use client";

import React, { useEffect, useState } from "react";
import {
  Book,
  Users,
  BarChart3,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAdminCourseStats,
  selectAdminCourseStats,
  selectAdminCourseStatsLoading,
  selectAdminCourseStatsError,
  selectTop3Coursess,
  selectAverageCompletionRate,
  selectTotalAdminCourses,
  selectedtotaluserscompleted,
  clearError,
  selectedtotalcourses,
  selectTotalAdminCoursesactive,
  selectedtotalcoursesactivate,
  selectedtotalcoursesEnrolled,
  selectAllCoursesWithStats,
} from "@/store/slices/adminslice/admindashboard";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const userId: any = getDecryptedItem("userId");

  // Redux selectors
  const stats = useAppSelector(selectAdminCourseStats);
  const loading = useAppSelector(selectAdminCourseStatsLoading);
  const error = useAppSelector(selectAdminCourseStatsError);
  const totalCourses = useAppSelector(selectTotalAdminCourses);
  const totalCoursesactive = useAppSelector(selectTotalAdminCoursesactive);
  const completionRate = useAppSelector(selectAverageCompletionRate);
  const totalcourse = useAppSelector(selectedtotalcourses);
  const totalactivarecourse = useAppSelector(selectedtotalcoursesactivate);
  const totalEnrollments = useAppSelector(selectedtotalcoursesEnrolled);
  const totalCompleted = useAppSelector(selectedtotaluserscompleted);
  const top3Courses = useAppSelector(selectTop3Coursess);
  const allcourse = useAppSelector(selectAllCoursesWithStats);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAdminCourseStats(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminCourseStats(userId));
  };

  // Prepare chart data
  const topCoursesChartData = top3Courses.map((course: any) => ({
    name: course.title?.substring(0, 15) || "Course",
    enrollments: course.enrollment_count || 0,
    completions: course.completion_count || 0,
  }));

  const enrollmentDistributionData = [
    {
      name: "Enrolled",
      value: (totalEnrollments || 0) - (totalCompleted || 0),
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: totalCompleted || 0,
      color: "#10b981",
    },
  ];

  const calculateTrend = (current: any, previous = 0) => {
    if (!previous) return "+0%";
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  // Loading state - Show skeleton loaders
  if (loading && !(stats as any).total_courses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto ">
          {/* Header Skeleton */}
          <div className="mb-8 h-32 animate-pulse rounded-2xl bg-gradient-to-r from-gray-300 to-gray-400 p-8 shadow-2xl dark:from-gray-700 dark:to-gray-600"></div>

          {/* Cards Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="mb-4 h-8 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
              <div className="mb-4 h-6 w-1/3 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-72 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 h-6 w-1/3 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-72 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-2 border-red-200 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-sm dark:border-red-500/50 dark:bg-gray-800/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">
              Error Loading Statistics
            </h3>
            <p className="mb-6 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto ">
        {/* Header with Gradient */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#02517b] to-[#02517bab] p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-white">
                <BarChart3 className="mr-3 h-10 w-10" />
                Course Performance Dashboard
              </h1>
              <p className="mt-2 text-blue-100">
                Track your course enrollments, completions, and performance
                metrics
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="mt-4 inline-flex items-center rounded-xl bg-white/20 px-6 py-3 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30 disabled:opacity-50 sm:mt-0"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh Stats"}
            </button>
          </div>
        </div>

        {/* Summary Statistics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Courses",
              value: totalcourse,
              icon: <Book className="h-8 w-8" />,
              gradient: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-500",
              sub: ` ${totalactivarecourse} Active course`,
              trend: calculateTrend(totalCourses),
            },
            {
              title: "Total Enrollments",
              value: totalEnrollments,
              icon: <Users className="h-8 w-8" />,
              gradient: "from-green-500 to-green-600",
              iconBg: "bg-green-500",
              sub: `Avg ${totalCompleted} per course`,
              trend: calculateTrend(totalEnrollments),
            },
            {
              title: "Completed",
              value: totalCompleted,
              icon: <CheckCircle className="h-8 w-8" />,
              gradient: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-500",
              sub: `${completionRate}% completion rate`,
              trend: calculateTrend(totalCompleted),
            },
            {
              title: "Top Course",
              value: top3Courses[0]?.enrollment_count || 0,
              icon: <Award className="h-8 w-8" />,
              gradient: "from-purple-500 to-purple-600",
              iconBg: "bg-purple-500",
              sub: top3Courses[0]?.title?.substring(0, 20) || "No courses",
              trend: "+0%",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="absolute right-0 top-0 h-32 w-32 opacity-10">
                <div
                  className={`h-full w-full rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`}
                ></div>
              </div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.title}
                    </p>
                    <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {card.sub}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-semibold">
                        {card.trend}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-lg transition-transform group-hover:scale-110`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Top 3 Courses Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Zap className="mr-2 h-5 w-5 text-yellow-600" />
              Top 3 Performing Courses
            </h3>
            {topCoursesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCoursesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280dd" textAnchor="end"/>
                  <YAxis stroke="#6b7280" />
                  <Tooltip /> 
                  <Legend />
                  <Bar
                    dataKey="enrollments"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="completions"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-500">
                No course data available
              </div>
            )}
          </div>

          {/* Enrollment Distribution Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              Enrollment Distribution
            </h3>
            {enrollmentDistributionData[0].value > 0 ||
            enrollmentDistributionData[1].value > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={enrollmentDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      name,
                      percent,
                    }: {
                      name?: string;
                      percent?: number;
                    }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {enrollmentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-500">
                No enrollment data available
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Courses Details Table */}
        {top3Courses.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Book className="mr-2 h-5 w-5 text-indigo-600" />
              Top 3 Courses Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Course Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Enrollments
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Completions
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Completion Rate
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top3Courses.map((course: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div className="line-clamp-2 font-medium">
                          {course.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {course.enrollment_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          {course.completion_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{
                                width: `${
                                  course.enrollment_count > 0
                                    ? (course.completion_count /
                                        course.enrollment_count) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {course.enrollment_count > 0
                              ? (
                                  (course.completion_count /
                                    course.enrollment_count) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 font-medium">
                            {course.ratings || "N/A"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && top3Courses.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800/50">
            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-600 dark:text-gray-400">
              No courses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You haven't created any courses yet. Start creating courses to see
              your performance metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
