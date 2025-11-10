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
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useApiClient } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StatCard from "@/app/ui-elements/StatCard";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer";

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

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  courses: Course[];
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9, // You can adjust this as needed
  });

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [pagination.currentPage]); // Refetch when page changes

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `course/list?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`,
      );
      if (response?.data.success) {
        const data: PaginationData = response.data.data;
        setCourses(data.courses);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalItems: data.total,
        }));
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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2),
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1,
    );

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900`}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={
        "min-h-screen overflow-auto bg-gray-50 px-6 pb-8 pt-6 dark:bg-gray-900"
      }
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <FileBadge className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Courses
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  View and manage all courses in your platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div
        className={` mb-8 rounded-2xl  shadow-gray-200/60 transition-colors duration-200`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search Input */}
          <div className="flex-1 ">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Courses
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search by course title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    fetchCourses();
                  }
                }}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value as "all" | "active" | "inactive" | "draft",
                );
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 lg:pt-0">
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800/50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 rounded-full p-0.5 hover:bg-green-200 dark:hover:bg-green-800/50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={pagination.totalItems}
          icon={BookOpen}
          color="blue"

        />
        <StatCard
          title="Active Courses"
          value={courses.filter((c) => c.status === "active").length}
          icon={CheckCircle}
          color="green"

        />
        <StatCard
          title="Draft Courses"
          value={courses.filter((c) => c.status === "draft").length}
          icon={FileText}
          color="yellow"

        />
        <StatCard
          title="Inactive Courses"
          value={courses.filter((c) => c.status === "inactive").length}
          icon={EyeOff}
          color="red"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm dark:bg-gray-800">
          <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-700">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="max-w-sm text-center text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "Get started by creating your first course to build your learning platform."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link
              href={"/admin/courses/add-courses"}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Create Your First Course
            </Link>
          )}
        </div>
      )}

      {/* Pagination Component */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination.totalItems}
            </span>{" "}
            courses
          </div>

          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 ${page === pagination.currentPage
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const handleViewUsers = () => {
    window.location.href = `/admin/enangement/users?id=${course.id}`;
  };

  const statusColors = {
    active: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    inactive: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    draft: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
    >


      <div className="p-6 space-y-4">
        {/* Title and status */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusColors[course.status]}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${course.status === "active"
              ? "bg-green-500"
              : course.status === "inactive"
                ? "bg-red-500"
                : "bg-amber-500"
              }`}
          />
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>

        {/* Description */}
        <div className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <SafeHtmlRenderer
            html={course.description}
            maxLength={120}
            className="text-sm"
            showMoreButton={false}
          />
        </div>

        {/* Bottom info row */}
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            {course.enrollment_count} enrolled
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {course.category}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 px-6 py-4 flex gap-3">
        <button
          onClick={handleViewUsers}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <Users className="h-4 w-4" />
          View Users
        </button>

        {/* Optionally enable certificates */}
        {/* <button
          onClick={handleViewCertificates}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <Award className="h-4 w-4" />
          Certificates
        </button> */}
      </div>
    </div>
  );
};


export default CourseManagementDashboard;
