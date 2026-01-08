"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, ImageIcon, VideoIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function Chapters({ className }: any) {
  const api = useApiClient();

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeMedia, setActiveMedia] = useState<any>({
    type: "image",
    items: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const fetchChapters = async (course_id: string) => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);

      const res = await api.get(`chapter/course/?course_id=${course_id}`);
      if (res.success) {
        setChapters(res.data?.data?.data?.chapters || []);
        setTotalPages(res.data?.data?.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chapters:", err);
    }
  };

  useEffect(() => {
    if (courseId) fetchChapters(courseId);
  }, [page, search, courseId]);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-md dark:bg-gray-dark",
        className,
      )}
    >
      {/* Header + Search */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-dark dark:text-white">
          Select Chapter to Add Lesson
        </h2>

        <div className="relative w-full sm:w-[300px]">
          <input
            type="search"
            placeholder="Search Chapters ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
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
              {activeMedia.type === "image"
                ? "Chapter Images"
                : "Chapter Videos"}
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

      {/* Chapters Grid */}
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter: any) => (
            <div
              key={chapter.id}
              onClick={() =>
                router.push(
                  `/super-admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {chapter.title}
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                {chapter.content?.slice(0, 100)}...
              </p>

              <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700">
                  Order: {chapter.order}
                </span>
                <span className="rounded-full bg-green-200 px-3 py-1 dark:bg-green-700">
                  {chapter.courseName || "Course Name"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {chapter.images?.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveMedia({
                          type: "image",
                          items: chapter.images,
                        });
                        setShowMediaModal(true);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-white"
                    >
                      <ImageIcon size={16} /> View Images
                    </button>
                  )}

                  {chapter.videos?.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveMedia({
                          type: "video",
                          items: chapter.videos,
                        });
                        setShowMediaModal(true);
                      }}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800"
                    >
                      <VideoIcon size={16} /> View Videos
                    </button>
                  )}
                </div>

                <span className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(chapter.createdAt))}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-600 dark:text-gray-300">
          No chapters found
        </div>
      )}

      {/* Pagination */}
      {chapters.length > 0 && (
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
