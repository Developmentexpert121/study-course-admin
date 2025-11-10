"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, SearchIcon, ImageIcon, VideoIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useApiClient } from "@/lib/api";

export default function Lessons({ className }: any) {
  const api = useApiClient();

  const [search, setSearch] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseName, setCourseName] = useState("");
  const [chapterorder, setChapterOrder] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeMedia, setActiveMedia] = useState<any>({
    type: "image",
    items: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter_id");
  const courseId = searchParams.get("course_id");
  const router = useRouter();

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (chapterId) fetchLessons(chapterId);
  }, [page, search, chapterId]);

  const fetchLessons = async (chapter_id: string) => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);

      const res = await api.get(
        `lessons/chapter/lessons/paginated?chapter_id=${chapter_id}&${query.toString()}`,
      );

      if (res.success) {
        const data = res?.data?.data?.data?.lessons || [];
        setLessons(data);
        setCourseName(res?.data?.data?.data?.course?.title);
        setChapterName(res?.data?.data?.data?.chapter?.title);
        setChapterOrder(res?.data?.data?.data?.chapter?.order);
        const totalLessons =
          res.data.data.data?.pagination?.total || data.length;
        setTotalPages(Math.ceil(totalLessons / limit));
      }
    } catch (err) {
      console.error("❌ Failed to fetch lessons:", err);
    }
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm("🗑️ Are you sure you want to delete this lesson?")) return;

    try {
      const res = await api.delete(`lessons/${lessonId}`);
      if (res.success) {
        toasterSuccess("Lesson deleted successfully!", 3000, "id");

        if (lessons.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchLessons(chapterId!);
        }
      } else {
        toasterError(res.error.code, 1000, "id");
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("⚠️ Something went wrong while deleting the lesson.");
    }
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-md dark:bg-gray-dark",
        className,
      )}
    >
      <div className="tab-buttons mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="w-96 text-base font-bold leading-snug text-dark dark:text-white sm:text-lg md:text-xl lg:text-2xl">
          Lesson List for course: {courseName}
          <br className="block sm:hidden" /> {/* Break only on mobile */}
          <span className="block sm:inline">
            chapter: {chapterorder} {chapterName}
          </span>
        </h2>

        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search Lessons ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus:[#005479] w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#005479] focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          <button
            onClick={() =>
              router.push(
                `/admin/chapters?course=${courseName}&course_id=${courseId}`,
              )
            }
            className="w-full rounded-full bg-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:w-auto"
          >
            ← Back to {courseName} Chapters
          </button>
          <button
            onClick={() =>
              router.push(
                `/admin/lessons/list/create-lessons?chapter_id=${chapterId}&course_id=${courseId}`,
              )
            }
            className="flex items-center justify-center gap-2 rounded-full bg-[#005479] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#01537969] dark:bg-[#1dbd96]"
          >
            <PlusCircleIcon size={18} />
            Add Lesson
          </button>
        </div>
      </div>

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
              {activeMedia.type === "image" ? "Lesson Images" : "Lesson Videos"}
            </h3>

            <div
              className={cn(
                "mx-auto grid gap-4",
                activeMedia.items.length <= 1
                  ? "grid-cols-1"
                  : `grid-cols-${Math.min(activeMedia.items.length, 4)}`,
              )}
            >
              {activeMedia.items.map((url: string, idx: number) =>
                activeMedia.type === "image" ? (
                  <img
                    key={idx}
                    src={url}
                    alt={`media-${idx}`}
                    className="cursor-pointer rounded-lg border object-cover shadow-md transition-transform hover:scale-[1.02]"
                  />
                ) : (
                  <video
                    key={idx}
                    src={url}
                    controls
                    className="rounded-lg border shadow-md"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson: any) => {
            const images =
              lesson.resources
                ?.filter((r: any) => r.type === "image")
                .map((r: any) => r.url) || [];
            const videos = lesson.video_url ? [lesson.video_url] : [];

            return (
              <div
                key={lesson.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-5"
              >
                <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                  {lesson.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {lesson.content?.slice(0, 100)}...
                </p>

                <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  <span className="rounded-full px-2 py-1 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] dark:bg-gray-700 sm:px-3">
                    Order: {lesson.order}
                  </span>
                  <span className="rounded-full bg-[#005479] px-2 py-1 text-white dark:bg-[#1dbd96] sm:px-3">
                    Duration: {lesson.duration || "N/A"} mins
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {images.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveMedia({ type: "image", items: images });
                          setShowMediaModal(true);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ImageIcon size={16} /> Images
                      </button>
                    )}

                    {videos.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveMedia({ type: "video", items: videos });
                          setShowMediaModal(true);
                        }}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800"
                      >
                        <VideoIcon size={16} /> Videos
                      </button>
                    )}

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/lessons/list/edit-lessons?lesson_id=${lesson.id}&chapter_id=${chapterId}&course_id=${courseId}`,
                        )
                      }
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <span className="text-[10px] text-gray-400 sm:text-xs">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(lesson.createdAt))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-600 dark:text-gray-300">
          No lessons found
        </div>
      )}

      {lessons.length > 0 && (
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
