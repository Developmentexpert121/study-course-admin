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
  DollarSign,
  BookOpen,
  Award,
  Target,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchInstructorDashboardStats,
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
  clearError,
} from "@/store/slices/adminslice/admindashboard";
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
  ComposedChart,
} from "recharts";

export default function InstructorDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux selectors
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  console.log("Instructor Dashboard Stats Data:", stats);

  useEffect(() => {
    dispatch(fetchInstructorDashboardStats());
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
    dispatch(fetchInstructorDashboardStats());
  };

  // Prepare chart data from API
  const courseStatusData = [
    {
      name: "Active",
      value: stats?.courses?.active || 0,
      color: "#10b981",
    },
    {
      name: "Inactive",
      value: stats?.courses?.inactive || 0,
      color: "#ef4444",
    },
    {
      name: "Draft",
      value: stats?.courses?.draft || 0,
      color: "#3b82f6",
    },
  ];

  const enrollmentStatusData = [
    {
      name: "Active",
      value: stats?.enrollments?.active || 0,
      fill: "#10b981",
    },
    {
      name: "Completed",
      value: stats?.enrollments?.completed || 0,
      fill: "#3b82f6",
    },
    {
      name: "Total",
      value: stats?.enrollments?.total || 0,
      fill: "#8b5cf6",
    },
  ];

  const revenuePerformanceData = [
    {
      name: "Total Revenue",
      value: parseFloat(stats?.performance?.totalRevenue || "0"),
      fill: "#10b981",
    },
    {
      name: "Avg Rating",
      value: parseFloat(stats?.performance?.averageRating?.toString() || "0"),
      fill: "#f59e0b",
    },
  ];

  const studentMetricsData = [
    {
      name: "Total Students",
      count: stats?.students?.total || 0,
    },
    {
      name: "Avg Per Course",
      count: parseFloat(stats?.students?.averagePerCourse?.toString() || "0"),
    },
  ];

  const coursePerformanceData = [
    {
      name: "Courses",
      total: stats?.courses?.total || 0,
      active: stats?.courses?.active || 0,
      draft: stats?.courses?.draft || 0,
    },
  ];

  const enrollmentTrendData = [
    {
      name: "Enrollments",
      total: stats?.enrollments?.total || 0,
      active: stats?.enrollments?.active || 0,
      completed: stats?.enrollments?.completed || 0,
      completionRate: parseFloat(stats?.enrollments?.completionRate?.replace('%', '') || "0"),
    },
  ];

  const certificateStatsData = [
    {
      name: "Certificates",
      issued: stats?.certificates?.total || 0,
      completionRate: parseFloat(stats?.enrollments?.completionRate?.replace('%', '') || "0"),
    },
  ];

  // Calculate growth percentages
  const calculateTrend = (current: any, previous = 0) => {
    if (!previous) return "+0%";
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading instructor dashboard statistics...
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
                Instructor Dashboard
              </h1>
              <p className="mt-2 text-blue-100">
                Comprehensive statistics and insights about your courses and students
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

        {/* Summary Statistics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Courses",
              value: stats?.courses?.total || 0,
              icon: <Book className="h-8 w-8" />,
              gradient: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-500",
              sub: `${stats?.courses?.active || 0} active`,
              trend: calculateTrend(stats?.courses?.total),
            },
            {
              title: "Total Students",
              value: stats?.students?.total || 0,
              icon: <Users className="h-8 w-8" />,
              gradient: "from-green-500 to-green-600",
              iconBg: "bg-green-500",
              sub: `${stats?.students?.averagePerCourse || 0} avg/course`,
              trend: calculateTrend(stats?.students?.total),
            },
            {
              title: "Total Enrollments",
              value: stats?.enrollments?.total || 0,
              icon: <User className="h-8 w-8" />,
              gradient: "from-purple-500 to-purple-600",
              iconBg: "bg-purple-500",
              sub: `${stats?.enrollments?.completed || 0} completed`,
              trend: calculateTrend(stats?.enrollments?.total),
            },
            {
              title: "Total Revenue",
              value: `$${stats?.performance?.totalRevenue || "0"}`,
              icon: <DollarSign className="h-8 w-8" />,
              gradient: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-500",
              sub: `Avg rating: ${stats?.performance?.averageRating || 0}`,
              trend: calculateTrend(parseFloat(stats?.performance?.totalRevenue || "0")),
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

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Course Status Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Book className="mr-2 h-5 w-5 text-blue-600" />
              Course Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Enrollment Status Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Enrollment Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {enrollmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue & Rating Composed Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <DollarSign className="mr-2 h-5 w-5 text-orange-600" />
              Revenue & Rating
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenuePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Student Metrics Area Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
              Student Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={studentMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
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

          {/* Course Performance Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Activity className="mr-2 h-5 w-5 text-red-600" />
              Course Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total Courses" />
                <Bar dataKey="active" fill="#10b981" radius={[8, 8, 0, 0]} name="Active Courses" />
                <Bar dataKey="draft" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Draft Courses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Certificate Stats Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Award className="mr-2 h-5 w-5 text-yellow-600" />
              Certificate Statistics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Certificates Issued', value: stats?.certificates?.total || 0, color: '#10b981' },
                    { name: 'Completion Rate', value: parseFloat(stats?.enrollments?.completionRate?.replace('%', '') || "0"), color: '#3b82f6' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key="cell-0" fill="#10b981" />
                  <Cell key="cell-1" fill="#3b82f6" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Completion Rate */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Completion Rate
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.enrollments?.completionRate || "0%"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Course completion success
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500 text-white">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Average Chapters per Course */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Avg Chapters/Course
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.chapters?.averagePerCourse || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Content distribution
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500 text-white">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Student Engagement */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Student Engagement
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.performance?.averageRating || 0}/5
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average course rating
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500 text-white">
                <Star className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}