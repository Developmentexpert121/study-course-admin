"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  Unlock,
  RefreshCw,
  XCircle,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCoursesWithProgress, clearCourses } from "@/store/slices/adminslice/userprogress";

export default function UserDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const dispatch = useAppDispatch();

  const { courses, loading, error } = useAppSelector((state) => state.courses);
  useEffect(() => {
    if (userId) {
      dispatch(fetchCoursesWithProgress(parseInt(userId, 10)));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCourses());
    };
  }, [userId, dispatch]);

  const handleRefresh = () => {
    if (userId) {
      dispatch(fetchCoursesWithProgress(parseInt(userId, 10)));
    }
  };

  const calculateCourseProgress = (chapters: any[]) => {
    const totalChapters = chapters.length;
    const unlockedChapters = chapters.filter((ch) => !ch.locked).length;
    return totalChapters > 0 ? Math.round((unlockedChapters / totalChapters) * 100) : 0;
  };

  const getCourseStats = () => {
    const totalCourses = courses.length;
    const enrolledCourses = courses.filter((course) =>
      course.chapters.some((ch) => !ch.locked)
    ).length;
    const totalChapters = courses.reduce((sum, course) => sum + course.chapters.length, 0);
    const unlockedChapters = courses.reduce(
      (sum, course) => sum + course.chapters.filter((ch) => !ch.locked).length,
      0
    );

    return { totalCourses, enrolledCourses, totalChapters, unlockedChapters };
  };

  const stats = getCourseStats();

  // Strip HTML tags for display
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-[#02517b] dark:border-[#43bf79]"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-500/50 dark:bg-red-900/20">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-400">
              Error Loading User Details
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
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
           
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex  gap-4 ">
        
            <div>
              <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <GraduationCap className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
                User Learning Progress
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                User ID: {userId}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center">
             <button
              onClick={() => router.back()}
              className="  inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Courses */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Enrolled
                </p>
                <p className="mt-2 text-3xl font-bold text-[#02517b] dark:text-[#43bf79]">
                  {stats.enrolledCourses}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02517b]/10 dark:bg-[#43bf79]/20">
                <CheckCircle className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Total Chapters */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Chapters
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalChapters}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Unlocked Chapters */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Unlocked
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.unlockedChapters}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Unlock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {courses.length > 0 ? (
            courses.filter((course) => course.chapters.some((ch) => !ch.locked)).map((course) => {
              const progress = calculateCourseProgress(course.chapters);
              const isEnrolled = course.chapters.some((ch) => !ch.locked);

              return (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Course Header with Image */}
                  <div className="relative">
                    {/* Course Image */}
                    {course.image && (
                      <div className="h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="text-2xl font-bold text-white">
                                {course.title}
                              </h3>
                              {isEnrolled ? (
                                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                  Enrolled
                                </span>
                              ) : (
                                <span className="rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white">
                                  Not Enrolled
                                </span>
                              )}
                            </div>
                            <p className="mb-2 text-sm text-white/90 line-clamp-2">
                              {stripHtml(course.description)}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                              <span className="flex items-center">
                                <BookOpen className="mr-1 h-4 w-4" />
                                {course.chapters.length} Chapters
                              </span>
                              <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium">
                                {course.category}
                              </span>
                            </div>
                          </div>
                          
                          {/* Progress Circle */}
                          <div className="flex flex-col items-center">
                            <div className="relative h-20 w-20">
                              <svg className="h-20 w-20 -rotate-90 transform">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  fill="transparent"
                                  className="text-white/30"
                                />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 36}`}
                                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                                  className="text-green-400 transition-all duration-500"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-white">{progress}%</span>
                              </div>
                            </div>
                            <span className="mt-1 text-xs text-white/80">Progress</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapters List */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Course Chapters
                      </h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course.chapters.filter(ch => !ch.locked).length} of {course.chapters.length} unlocked
                      </span>
                    </div>
                    <div className="space-y-3">
                      {course.chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className={`flex items-start justify-between rounded-lg border p-4 transition-all ${
                            chapter.locked
                              ? "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900"
                              : "border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                          }`}
                        >
                          <div className="flex flex-1 items-start gap-4">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                chapter.locked
                                  ? "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              <span className="font-bold">{chapter.order}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`font-semibold ${
                                  chapter.locked
                                    ? "text-gray-700 dark:text-gray-300"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {chapter.title}
                              </h5>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {chapter.content}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {chapter.locked ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                <Lock className="mr-1 h-3.5 w-3.5" />
                                Locked
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <Unlock className="mr-1 h-3.5 w-3.5" />
                                Unlocked
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                No Courses Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This user has no course data available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}