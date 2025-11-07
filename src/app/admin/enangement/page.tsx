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
  CheckCircle,
  FileText,
  EyeOff,
  FileBadge,
} from "lucide-react";
import { useApiClient } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StatCard from "@/app/ui-elements/StatCard";

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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "draft">("all");
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
    (course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    }
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
      className={
        "grid overflow-auto rounded-[10px] px-7.5 pb-4 pt-7.5 dark:bg-gray-dark "
      }
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <FileBadge className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
            Courses
          </h1>
          <p className="mt-2 text-gray-600 dark:text-white">
            View and manage all Courses
          </p>
        </div>

        {/* Add Course Button */}
        <Link
          href={"/admin/courses/add-courses"}
          className="rounded-lg bg-[#02517b] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#013d5b] sm:w-auto"
        >
          + Add Course
        </Link>
      </div>


      {/* Search and Filter */}
      <div
        className={`mb-6 rounded-lg border p-6 shadow-sm transition-colors duration-200 ${isDarkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
          }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchCourses();
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "active" | "inactive" | "draft",
              )
            }
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={fetchCourses}
              className="inline-flex items-center justify-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </button>

            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>


        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Status: {statusFilter}
              </span>
            )}
          </div>
        )}
      </div>


      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="blue" />
        <StatCard title="Active" value={courses.filter(c => c.status === "active").length} icon={CheckCircle} color="green" />
        <StatCard title="Draft" value={courses.filter(c => c.status === "draft").length} icon={FileText} color="yellow" />
        <StatCard title="Inactive" value={courses.filter(c => c.status === "inactive").length} icon={EyeOff} color="red" />
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
      className={`group rounded-xl border shadow-sm transition-all duration-300 hover:shadow-xl ${isDarkMode
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
              className={`rounded-lg p-1 transition-colors duration-200 ${isDarkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div
                className={`absolute right-0 top-8 z-10 w-48 rounded-lg border py-1 shadow-lg ${isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
                  }`}
              >
                <button
                  className={`flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 ${isDarkMode
                    ? "text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </button>
                <button
                  className={`flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 ${isDarkMode
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
          className={`mb-4 line-clamp-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
        >
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span
            className={`flex items-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            <Users className="mr-1 h-4 w-4" />
            {course.enrollment_count} enrolled
          </span>
          <span
            className={`rounded px-2 py-1 text-xs ${isDarkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            {course.category}
          </span>
        </div>
      </div>

      <div
        className={`rounded-b-xl border-t px-6 py-4 transition-colors duration-200 ${isDarkMode
          ? "border-gray-700 bg-gray-800/50"
          : "border-gray-200 bg-gray-50"
          }`}
      >
        <div className="flex space-x-3">
          <button
            onClick={handleViewUsers}
            className={`inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${isDarkMode
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
