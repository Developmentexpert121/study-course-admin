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

  const handleCourseClick = (courseId: number) => {
    router.push(`/user-panel/courses/${courseId}/chapter`);
  };

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

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Enrolled Courses
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Continue your learning journey
          </p>
        </div>

        <div className="flex w-full sm:w-64">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : enrollments.length > 0 ? (
        <>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {enrollments.map((enrollment: any) => {
              const { course, progress } = enrollment;
              const progressPercent = getCourseProgress(progress);
              const isCompleted = progressPercent >= 100;

              return (
                <div
                  key={enrollment.enrollment_id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full">
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {progressPercent}% Complete
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1 h-3 w-3" />
                      Enrolled on {formatDate(enrollment.enrolled_at)}
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                      {truncateText(
                        course.description?.replace(/<[^>]*>?/gm, ""),
                        100,
                      )}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <button
                        onClick={() => handleCourseClick(course.id)}
                        className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Completed
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Continue
                          </>
                        )}
                      </button>

                      {isCompleted ? (
                        <button
                          onClick={() =>
                            router.push(
                              `/user-panel/courses_result/${enrollment.user_id}?course_id=${course.id}`,
                            )
                          }
                          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-white transition-all duration-200 hover:from-yellow-600 hover:to-yellow-700"
                        >
                          <Award className="mr-2 h-4 w-4" /> Certificate
                        </button>
                      ) : (
                        <button
                          onClick={() => unenrollFromCourse(course.id)}
                          className="flex items-center justify-center rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Unenroll
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
            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {enrollments.length} courses
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No enrolled courses
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {search
                ? "No courses match your search"
                : "You haven't enrolled in any courses yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
