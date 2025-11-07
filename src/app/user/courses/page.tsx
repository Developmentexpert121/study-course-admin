"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Calendar,
  BookOpen,
  Play,
  Trash2,
  CheckCircle,
  Award,
  Loader2,
  Clock,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function EnrolledCourses({ className }: any) {
  const router = useRouter();
  const api = useApiClient();

  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [role, setRole] = useState<any>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);
  const [loading, setLoading] = useState(true);
  const [progressFilter, setProgressFilter] = useState("all");

  // ✅ Fetch Enrolled Courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const targetUserId: any = getDecryptedItem("userId");
      if (!targetUserId) return console.error("User ID missing");

      const query = new URLSearchParams({
        userId: targetUserId,
        page: String(page),
        limit: String(limit),
      });
      if (search) query.append("search", search);

      const res = await api.get(`enroll?${query.toString()}`);
      if (res.success) {
        setEnrollments(res.data.data.enrollments);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    setRole(getDecryptedItem("role"));
  }, [search, page]);

  const unenrollFromCourse = async (courseId: number) => {
    try {
      const userId = getDecryptedItem("userId");
      const res = await api.delete(
        `enroll/course/unenroll?user_id=${userId}&course_id=${courseId}`,
      );
      if (res.success) {
        toasterSuccess("Unenrolled successfully", 2000, "unenroll");
        fetchEnrolledCourses();
      }
    } catch (error) {
      console.error("Unenroll error:", error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const truncateText = (text: string, maxLength: number) =>
    text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  // ✅ Calculate course progress dynamically
  const getCourseProgress = (progress: any) => {
    if (!progress) return 0;
    const { total_chapters, completed_chapters } = progress;
    return total_chapters > 0
      ? Math.round((completed_chapters / total_chapters) * 100)
      : 0;
  };

  // Filter courses based on progress
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const progress = getCourseProgress(enrollment.progress);

    switch (progressFilter) {
      case "completed":
        return progress === 100;
      case "in-progress":
        return progress > 0 && progress < 100;
      case "not-started":
        return progress === 0;
      default:
        return true;
    }
  });

  // Calculate stats
  const stats = {
    total: enrollments.length,
    completed: enrollments.filter((e) => getCourseProgress(e.progress) === 100)
      .length,
    inProgress: enrollments.filter((e) => {
      const progress = getCourseProgress(e.progress);
      return progress > 0 && progress < 100;
    }).length,
    notStarted: enrollments.filter((e) => getCourseProgress(e.progress) === 0)
      .length,
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "from-green-500 to-emerald-600";
    if (progress >= 70) return "from-blue-500 to-cyan-600";
    if (progress >= 30) return "from-yellow-500 to-amber-600";
    return "from-gray-400 to-gray-500";
  };

  const getProgressIcon = (progress: number) => {
    if (progress === 100)
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (progress > 0) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            My Learning Journey
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Track your progress and continue where you left off
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed}
                </p>
              </div>
              <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.inProgress}
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Not Started
                </p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.notStarted}
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3 dark:bg-gray-700">
                <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Progress Filter */}
              <div className="sm:w-48">
                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Progress</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Filter className="h-4 w-4" />
              Showing {filteredEnrollments.length} of {enrollments.length}{" "}
              courses
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white dark:bg-gray-800">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading your courses...
              </p>
            </div>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredEnrollments.map((enrollment: any) => {
                const { course, progress } = enrollment;
                const progressPercent = getCourseProgress(progress);
                const isCompleted = progressPercent >= 100;

                return (
                  <div
                    key={enrollment.enrollment_id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Progress Ribbon */}
                    <div className="absolute -right-8 top-6 z-10 rotate-45 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-1 text-xs font-semibold text-white shadow-lg">
                      {progressPercent}%
                    </div>

                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Course Info */}
                    <div className="p-6">
                      {/* Course Meta */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(enrollment.enrolled_at)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          {getProgressIcon(progressPercent)}
                          <span
                            className={
                              isCompleted ? "text-green-600" : "text-blue-600"
                            }
                          >
                            {isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {course.title}
                      </h3>

                      {/* Course Description */}
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {truncateText(
                          course.description?.replace(/<[^>]*>?/gm, ""),
                          120,
                        )}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Your Progress
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(progressPercent)} shadow-lg transition-all duration-1000`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {progress?.completed_chapters || 0} of{" "}
                          {progress?.total_chapters || 0} chapters completed
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            router.push(`/user/courses/learn?id=${course.id}`)
                          }
                          className={`group flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                            isCompleted
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Review
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Continue
                            </>
                          )}
                        </button>

                        {isCompleted ? (
                          <button
                            onClick={() => router.push(`/user/certificates`)}
                            className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-yellow-600 hover:to-amber-600 hover:shadow-xl"
                          >
                            <Award className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => unenrollFromCourse(course.id)}
                            className="group flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages} • {enrollments.length} total
                  courses
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        page <= 3
                          ? i + 1
                          : page >= totalPages - 2
                            ? totalPages - 4 + i
                            : page - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "border border-gray-300 bg-white text-gray-700 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-lg dark:bg-gray-800">
            <div className="mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 p-8 dark:from-gray-700 dark:to-gray-600">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              {search || progressFilter !== "all"
                ? "No courses found"
                : "No enrolled courses"}
            </h3>
            <p className="mb-8 max-w-md text-center text-gray-600 dark:text-gray-400">
              {search || progressFilter !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start your learning journey by enrolling in courses that interest you."}
            </p>
            {(search || progressFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setProgressFilter("all");
                }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
