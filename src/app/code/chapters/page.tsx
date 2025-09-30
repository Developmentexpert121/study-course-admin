"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, Image as ImageIcon, Video } from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const fetchChapters = async (course_id: string) => {
    try {
      const query = new URLSearchParams();
      query.append("courseId", String(page));
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);

      const res = await api.get(`chapter/course/?course_id=${course_id}`);

      if (res.success) {
        setChapters(res.data?.data?.data?.chapters);
        setTotalPages(res.data?.data?.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chapters:", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchChapters(courseId);
    }
  }, [page, search, courseId]);





  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          All Chapters List
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search Chapters ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Add Chapter Button */}
          <button
            onClick={() => router.push(`/chapters/add-chapters?course_id=${courseId}`)}
            className="w-full sm:w-auto rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            + Add Chapter
          </button>
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            className={cn(
              "relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800",
              activeMedia.items.length === 1 ? "w-auto" : "w-[90vw]"
            )}
          >
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-red-500"
            >
              ✕
            </button>

            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {activeMedia.type === "image" ? "Chapter Images" : "Chapter Videos"}
            </h3>

            <div
              className={cn(
                "grid gap-4 mx-auto",
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
                          : "grid-cols-6"
              )}
              style={{ maxWidth: "fit-content" }}
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
                        "rounded border object-contain cursor-pointer",
                        activeMedia.items.length === 1
                          ? "h-auto max-h-[70vh] w-auto max-w-full"
                          : "h-32 w-48"
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
                        : "h-32 w-48"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Chapters Grid */}
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter: any) => (
            <div
              key={chapter.id}
               onClick={()=> router.push(`/code/code-questions-page?course_id=${courseId}&chapter_id=${chapter.id}`)}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                    {chapter.title}
                  </h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                    Order: {chapter.order}
                  </span>
                </div>
                
                {/* Actions */}
              
              </div>

              {/* Content Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {chapter.content?.slice(0, 100)}...
              </p>

              {/* Media Buttons */}
              <div className="flex items-center gap-3 mb-4">
                {chapter.images?.length > 0 ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    onClick={() => {
                      setActiveMedia({ type: "image", items: chapter.images });
                      setShowMediaModal(true);
                    }}
                  >
                    <ImageIcon size={16} />
                    {chapter.images.length} Image{chapter.images.length > 1 ? "s" : ""}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">No images</span>
                )}

                {chapter.videos?.length > 0 ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition"
                    onClick={() => {
                      setActiveMedia({ type: "video", items: chapter.videos });
                      setShowMediaModal(true);
                    }}
                  >
                    <Video size={16} />
                    {chapter.videos.length} Video{chapter.videos.length > 1 ? "s" : ""}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">No videos</span>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(chapter.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No chapters found</p>
        </div>
      )}

      {/* Pagination */}
      {chapters.length > 0 && (
        <div className="mt-6 flex justify-end items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer disabled:cursor-not-allowed  px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer px-4 py-2 disabled:cursor-not-allowed  bg-gray-200 rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}