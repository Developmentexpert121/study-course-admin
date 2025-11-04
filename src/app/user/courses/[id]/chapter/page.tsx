"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Pencil,
  Lock,
  BookOpen,
  ImageIcon,
  VideoIcon,
  FileText,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const userId = getDecryptedItem("userId");
  const api = useApiClient();

  const [chapters, setChaptersByid] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({
    type: "image",
    items: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoadingById] = useState(true);
  const [passedchapter, setpassedchapter] = useState<any>(null);

  const fetchChaptersWithStatus = async () => {
    if (!courseId || !userId) return;

    try {
      // Fetch both basic chapters and MCQ status in parallel
      const response = await api.get(
        `mcq/course-chapters-status?user_id=${userId}&course_id=${courseId}`,
      );

      // Store the complete responses
      console.log("------------", response?.data?.data?.chapters);
      setLoadingById(false);
      setChaptersByid(response?.data?.data?.chapters);
      // setpassedchapter(statusResponse?.data?.data)
    } catch (err) {
      console.log("Error fetching chapters:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchChaptersWithStatus();
  }, [courseId, userId]);

  const handleChapterClick = async (chapterId: number) => {
    try {
      const res = await api.get(`chapter/${chapterId}`);
      if (res.success) {
        router.push(`/user/chapters/${chapterId}`);
      } else {
        console.error("Failed to fetch chapter:", res);
      }
    } catch (error) {
      console.error("Error fetching chapter:", error);
    }
  };

  const fetchCourseName = async () => {
    try {
      const res = await api.get(`course/${courseId}`);
      if (res.success) {
        setCourseName(res.data?.data?.title || "Unknown Course");
      }
    } catch (err) {
      console.error("Failed to fetch course name:", err);
    }
  };

  useEffect(() => {
    fetchCourseName();
  }, []);

  if (loading) {
    return (
      <div className={cn("flex h-64 items-center justify-center", className)}>
        <div className="text-lg">Loading chapters...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Chapters
      </button>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {courseId ? "Course Chapters" : "All Chapters List"}
          </h2>
          {courseId && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {courseName ? `Course: ${courseName}` : `Course ID: ${courseId}`}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {/* Search Bar */}
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            className={cn(
              "relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800",
              activeMedia.items.length === 1 ? "w-auto" : "w-[90vw]",
            )}
          >
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-red-500"
            >
              ✕
            </button>

            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {activeMedia.type === "image" ? "Chapter Image" : "Chapter Video"}
            </h3>

            <div
              className={cn(
                "mx-auto grid gap-4",
                activeMedia.items.length <= 1
                  ? "grid-cols-1"
                  : activeMedia.items.length === 2
                    ? "grid-cols-2"
                    : activeMedia.items.length === 3
                      ? "grid-cols-3"
                      : activeMedia.items.length === 4
                        ? "grid-cols-4"
                        : activeMedia.items.length === 5
                          ? "grid-cols-5"
                          : "grid-cols-6",
              )}
              style={{
                maxWidth: "fit-content",
              }}
            >
              {activeMedia.items.map((url: any, idx: any) => {
                if (!url) return null;

                return activeMedia.type === "image" ? (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`media-${idx}`}
                      className={cn(
                        "cursor-pointer rounded border object-contain",
                        activeMedia.items.length === 1
                          ? "h-auto max-h-[70vh] w-auto max-w-full"
                          : "h-32 w-48",
                      )}
                    />
                  </a>
                ) : (
                  <video
                    key={idx}
                    src={url}
                    controls
                    className={cn(
                      "rounded border object-contain",
                      activeMedia.items.length === 1
                        ? "h-auto max-h-[70vh] w-auto max-w-full"
                        : "h-32 w-48",
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters &&
          chapters.map((chapter: any, index: number) => {
            const chapterProgress =
              passedchapter?.find(
                (progress: any) => progress.chapter_id === chapter.id,
              ) || null;

            // Locking logic with safety checks
            let isLocked = false;
            if (chapter.order > 1) {
              const prevChapter = chapters.find(
                (c) => c.order === chapter.order - 1,
              );
              if (prevChapter) {
                const prevChapterProgress = passedchapter?.find(
                  (progress: any) => progress.chapter_id === prevChapter.id,
                );
                isLocked = !prevChapterProgress?.passed;
              }
            }

            // Determine status text and icon
            let statusText = "Not started";
            let StatusIcon = Clock;
            let statusColor = "text-gray-500";

            if (chapterProgress) {
              if (chapterProgress.passed) {
                statusText = "Completed";
                StatusIcon = CheckCircle;
                statusColor = "text-green-600";
              } else if (chapterProgress.attempted) {
                statusText = "In progress";
                statusColor = "text-yellow-600";
              }
            }

            return (
              <div
                key={chapter.id} // Use chapter.id instead of index for better performance
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    {/* Left side - Chapter info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-800">
                          {chapter.order || index + 1}
                        </div>
                        <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                          {chapter.chapter_title}
                        </h3>
                      </div>

                      {/* Status and Media stats */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {/* Status */}

                        {/* Media stats */}
                        <div className="flex items-center">
                          <ImageIcon className="mr-1 h-3 w-3" />
                          <span>
                            {chapter.media_summary?.total_images} Images
                          </span>
                        </div>
                        <div className="flex items-center">
                          <VideoIcon className="mr-1 h-3 w-3" />
                          <span>
                            {chapter.media_summary?.total_videos} Videos
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="mr-1 h-3 w-3" />
                          <span>
                            {Math.ceil(chapter?.chapter_content.length / 1000)}k
                            words
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions and status */}
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleChapterClick(chapter.chapter_id)}
                        disabled={chapter.locked}
                        className={`flex items-center rounded-lg px-4 py-2 transition-colors ${
                          chapter.locked
                            ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        }`}
                      >
                        {chapter.locked ? (
                          <Lock className="mr-2 h-4 w-4" />
                        ) : (
                          <BookOpen className="mr-2 h-4 w-4" />
                        )}
                        {chapter.locked ? "Locked" : "Start Learning"}
                      </button>

                      {/* Progress indicator (optional) */}
                      {chapterProgress && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Progress: </span>
                          <span className="ml-1 font-medium">
                            {chapterProgress.passed
                              ? "100%"
                              : chapterProgress.attempted
                                ? "In Progress"
                                : "0%"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar (uncomment if you want visual progress) */}
                  {chapterProgress && (
                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1.5 rounded-full bg-green-600 transition-all duration-300"
                        style={{
                          width: chapterProgress.passed
                            ? "100%"
                            : chapterProgress.attempted
                              ? "50%"
                              : "0%",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}

      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {chapters && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {chapters.length} chapters
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            disabled={page == 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                    page === pageNum
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-2 text-gray-500">...</span>}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
