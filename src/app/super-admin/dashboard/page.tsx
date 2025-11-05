"use client";



import React, { useEffect } from "react";
import {
  Book,
  User,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  Eye,
  Mail,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardStatsLoading,
  selectDashboardStatsError,
  clearError,
} from "@/store/slices/adminslice/dashboardStatsSlice";
import { useRouter } from "next/navigation";

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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import CourseAuditLogsPage from "../courses-creation/CourseAuditLogsPage";

import RatingsManagementPage from "../../../app/super-admin/rating/RatingsManagementPage";

export default function DashboardStatsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux selectors
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardStatsLoading);
  const error = useAppSelector(selectDashboardStatsError);

  console.log("Dashboard Stats Data:", stats?.data);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  // Prepare chart data from API
  const userVerificationData = [
    {
      name: "Verified",
      value: stats?.data?.users?.userVerification?.verified || 0,
      color: "#10b981",
    },
    {
      name: "Unverified",
      value: stats?.data?.users?.userVerification?.unverified || 0,
      color: "#f59e0b",
    },
  ];

  const adminStatusData = [
    {
      name: "Approved",
      value: stats?.data?.users?.adminStatus?.approved || 0,
      fill: "#10b981",
    },
    {
      name: "Pending",
      value: stats?.data?.users?.adminStatus?.pending || 0,
      fill: "#f59e0b",
    },
    {
      name: "Rejected",
      value: stats?.data?.users?.adminStatus?.rejected || 0,
      fill: "#ef4444",
    },
  ];

  const courseStatusData = [
    {
      name: "Active",
      value: stats?.data?.courses?.active || 0,
      fill: "#10b981",
    },
    {
      name: "Inactive",
      value: stats?.data?.courses?.inactive || 0,
      fill: "#ef4444",
    },
    {
      name: "Draft",
      value: stats?.data?.courses?.draft || 0,
      fill: "#3b82f6",
    },
  ];

  const userRoleData = [
    {
      name: "Admins",
      count: stats?.data?.summary?.totalAdmins || 0,
    },
    {
      name: "Users",
      count: stats?.data?.users?.byRole?.user || 0,
    },
  ];

  // Enrollment metrics data
  const enrollmentMetricsData = [
    {
      name: "Total Enrollments",
      value: stats?.data?.summary?.totalEnrollments || 0,
      fill: "#3b82f6",
    },
    {
      name: "Total Courses",
      value: stats?.data?.summary?.totalCourses || 0,
      fill: "#10b981",
    },
    {
      name: "Avg Per Course",
      value: stats?.data?.summary?.totalCourses
        ? Math.round((stats?.data?.summary?.totalEnrollments || 0) / stats?.data?.summary?.totalCourses)
        : 0,
      fill: "#8b5cf6",
    },
  ];

  // Calculate growth percentages (you can modify these based on your historical data)
  const calculateTrend = (current: any, previous = 0) => {
    if (!previous) return "+0%";
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading dashboard statistics...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-2 border-red-200 bg-white/80 backdrop-blur-sm p-8 text-center shadow-2xl dark:border-red-500/50 dark:bg-gray-800/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-red-800 dark:text-red-400">
              Error Loading Statistics
            </h3>
            <p className="mb-6 text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
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
      <div className="mx-auto max-w-7xl">
        {/* Header with Gradient */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#02517b] to-[#43bf79] p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-white">
                <BarChart3 className="mr-3 h-10 w-10" />
                Dashboard Overview
              </h1>
              <p className="mt-2 text-blue-100">
                Comprehensive statistics and insights about your platform
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="mt-4 inline-flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 text-white shadow-lg transition-all hover:bg-white/30 hover:scale-105 disabled:opacity-50 sm:mt-0"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh Stats"}
            </button>
          </div>
        </div>

        {/* Summary Statistics Grid with API Data */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Student",
              value: stats?.data?.users?.byRole?.user || 0,
              icon: <Users className="h-8 w-8" />,
              gradient: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-500",
              sub: `${stats?.data?.users?.userVerification?.verified || 0} Verified`,
              trend: calculateTrend(stats?.data?.summary?.totalUsers),
            },

            {
              title: "Total Teachers",
              value: stats?.data?.users?.byRole?.admin || 0,
              icon: <Book className="h-8 w-8" />,
              gradient: "from-green-500 to-green-600",
              iconBg: "bg-green-500",
              sub: `${stats?.data?.users?.adminStatus?.approved || 0} active`,
              trend: calculateTrend(stats?.data?.summary?.totalCourses),
            },

            {
              title: "Total Courses",
              value: stats?.data?.summary?.totalCourses || 0,
              icon: <Book className="h-8 w-8" />,
              gradient: "from-green-500 to-green-600",
              iconBg: "bg-green-500",
              sub: `${stats?.data?.summary?.activeCourses || 0} active`,
              trend: calculateTrend(stats?.data?.summary?.totalCourses),
            },

            {
              title: "Total Certificates",
              value: stats?.data?.summary?.totalCertificates || 0,
              icon: <CheckCircle className="h-8 w-8" />,
              gradient: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-500",
              sub: "Issued to users",
              trend: calculateTrend(stats?.data?.summary?.totalCertificates),
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <div className={`h-full w-full rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`}></div>
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
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">{card.trend}</span>
                    </div>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section with Real API Data */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* User Verification Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              User Verification Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userVerificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) =>
                  //   `${name}: ${(percent * 100).toFixed(0)}%`
                  // }
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }

                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userVerificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Admin Status Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
              Admin Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {adminStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Status Horizontal Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Book className="mr-2 h-5 w-5 text-purple-600" />
              Course Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Area Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Users className="mr-2 h-5 w-5 text-orange-600" />
              User Roles Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Enrollment Metrics Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:col-span-2 xl:col-span-1">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Enrollment Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enrollmentMetricsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, value, percent }) =>
                  //   `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  // }


                  label={({ name, value, percent }: { name?: string; value?: any; percent?: number }) =>
                    `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                  }

                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {enrollmentMetricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white  shadow-lg dark:border-gray-700 dark:bg-gray-800">

          <CourseAuditLogsPage />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white  shadow-lg dark:border-gray-700 dark:bg-gray-800">

       <RatingsManagementPage/>
      </div>

    </div>
    </div >
  );
}