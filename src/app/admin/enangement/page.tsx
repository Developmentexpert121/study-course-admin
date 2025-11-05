// components/CourseManagementDashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  Download,
  Mail,
  Filter,
  Search,
  BarChart3,
  RefreshCw,
  MoreVertical,
  Eye,
  Settings,
} from "lucide-react";
import { useApiClient } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  enrollment_count: number;
  status: "active" | "inactive" | "draft";
  progress?: number;
}

interface Stats {
  total_courses: number;
  active_courses: number;
  total_enrollments: number;
  certificates_issued: number;
}

const CourseManagementDashboard: React.FC = () => {
  const api = useApiClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_courses: 0,
    active_courses: 0,
    total_enrollments: 0,
    certificates_issued: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    fetchCourses();
    fetchStats();

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("course/admin/all-courses");
      if (response?.data.success) {
        setCourses(response?.data.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("certificate/stats/overview");
      if (response?.data.success) {
        setStats({
          total_courses: response.data.data.total_courses,
          active_courses: response.data.data.active_courses,
          total_enrollments: response.data.data.total_enrollments,
          certificates_issued: response.data.data.total_certificates,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        total_courses: 0,
        active_courses: 0,
        total_enrollments: 0,
        certificates_issued: 0,
      });
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <div
        className={`border-b transition-colors duration-200 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold">Course Management</h1>
              <p
                className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Manage courses, users, and certificates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`rounded-lg p-2 transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isDarkMode ? "🌙" : "☀️"}
              </button>
              <button
                onClick={fetchCourses}
                className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Total Courses"
            value={stats.total_courses}
            color="blue"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Active Courses"
            value={stats.active_courses}
            color="green"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Total Enrollments"
            value={stats.total_enrollments}
            color="purple"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Award className="h-6 w-6" />}
            title="Certificates Issued"
            value={stats.certificates_issued}
            color="orange"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Search and Filter */}
        <div
          className={`mb-6 rounded-lg border p-6 shadow-sm transition-colors duration-200 ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-lg border py-2 pl-10 pr-4 transition-colors duration-200 focus:ring-2 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>
            <button
              className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen
              className={`mx-auto h-12 w-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
            />
            <h3 className="mt-2 text-sm font-medium">No courses found</h3>
            <p
              className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating a new course"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  isDarkMode: boolean;
}> = ({ icon, title, value, color, isDarkMode }) => {
  const colorClasses: any = {
    blue: {
      light: "bg-blue-50 border-blue-200 text-blue-600",
      dark: "bg-blue-900/20 border-blue-800 text-blue-400",
    },
    green: {
      light: "bg-green-50 border-green-200 text-green-600",
      dark: "bg-green-900/20 border-green-800 text-green-400",
    },
    purple: {
      light: "bg-purple-50 border-purple-200 text-purple-600",
      dark: "bg-purple-900/20 border-purple-800 text-purple-400",
    },
    orange: {
      light: "bg-orange-50 border-orange-200 text-orange-600",
      dark: "bg-orange-900/20 border-orange-800 text-orange-400",
    },
  };

  const currentColor = isDarkMode
    ? colorClasses[color].dark
    : colorClasses[color].light;

  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg ${currentColor}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-lg bg-white/50 p-2 dark:bg-gray-800/50">
          {icon}
        </div>
        <div className="ml-4">
          <h3
            className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {title}
          </h3>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const CourseCard: React.FC<{ course: Course; isDarkMode: boolean }> = ({
  course,
  isDarkMode,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    active: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-900/30 text-green-400",
    },
    inactive: {
      light: "bg-red-100 text-red-800",
      dark: "bg-red-900/30 text-red-400",
    },
    draft: {
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-900/30 text-yellow-400",
    },
  };

  const handleViewUsers = () => {
    window.location.href = `/admin/enangement/users?id=${course.id}`;
  };

  const handleViewCertificates = () => {
    window.location.href = `/admin/enangement/certificates?id=${course.id}`;
  };

  const currentStatusColor = isDarkMode
    ? statusColors[course.status].dark
    : statusColors[course.status].light;

  return (
    <div
      className={`group rounded-xl border shadow-sm transition-all duration-300 hover:shadow-xl ${
        isDarkMode
          ? "border-gray-700 bg-gray-800 hover:border-gray-600"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold transition-colors duration-200 group-hover:text-blue-600">
              {course.title}
            </h3>
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`rounded-lg p-1 transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div
                className={`absolute right-0 top-8 z-10 w-48 rounded-lg border py-1 shadow-lg ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  className={`flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </button>
                <button
                  className={`flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Course
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${currentStatusColor}`}
          >
            {course.status}
          </span>
        </div>

        <p
          className={`mb-4 line-clamp-2 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span
            className={`flex items-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Users className="mr-1 h-4 w-4" />
            {course.enrollment_count} enrolled
          </span>
          <span
            className={`rounded px-2 py-1 text-xs ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {course.category}
          </span>
        </div>
      </div>

      <div
        className={`rounded-b-xl border-t px-6 py-4 transition-colors duration-200 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800/50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex space-x-3">
          <button
            onClick={handleViewUsers}
            className={`inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </button>
          <button
            onClick={handleViewCertificates}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Award className="mr-2 h-4 w-4" />
            Certificates
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementDashboard;
