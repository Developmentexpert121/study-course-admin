"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import {
  Pencil,
  SearchIcon,
  Trash2,
  MoreVertical,
  BookOpen,
  FileQuestion,
} from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({
    type: "image",
    items: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const courseName = searchParams.get("course");
  const api = useApiClient();
  useEffect(() => {
    if (courseId) {
      fetchChapters(courseId);
    }
  }, [page, search, courseId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchChapters = async (course_id: string) => {
    try {
      const res = await api.get(
        `chapter/course/?course_id=${course_id}&page=${page}&limit=${limit}&search=${search}`,
      );
      if (res.success) {
        setChapters(res.data?.data?.data?.chapters || []);
        setTotalPages(res.data?.data?.data?.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chapters:", err);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, chapterId: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === chapterId ? null : chapterId);
  };

  const handleEdit = (id: number) => {
    setActiveDropdown(null);
    router.push(`/admin/chapters/edit-chapters?id=${id}`);
  };
  const handleDelete = async (id: number) => {
    setActiveDropdown(null);
    const confirmDelete = confirm(
      "Are you sure you want to delete this chapter?",
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`chapter/${id}`);
      if (response.success) {
        toasterSuccess("Chapter Deleted Successfully", 3000, "id");

        // Check if this was the last item on the current page
        if (chapters.length === 1 && page > 1) {
          // If it was the last item and we're not on page 1, go to previous page
          setPage((prev) => prev - 1);
        } else {
          // Otherwise, refresh the current page
          if (courseId) {
            await fetchChapters(courseId);
          }
        }
      } else {
        toasterError(response.error.code, 3000, "id");
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  const handleAddLessons = (chapterId: number) => {
    setActiveDropdown(null);
    router.push(
      `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapterId}`,
    );
  };

  const handleAddMCQs = (chapterId: number) => {
    setActiveDropdown(null);
    router.push(
      `/admin/mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
    );
  };

  const getDropdownPosition = () => {
    if (!activeDropdown) return {};

    const button = buttonRefs.current[activeDropdown];
    if (!button) return {};

    const rect = button.getBoundingClientRect();

    return {
      position: "fixed" as const,
      top: rect.bottom + 5,
      left: rect.right - 192,
      zIndex: 9999,
    };
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="chapters mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          All Chapters list from {courseName}
        </h2>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search Chapters ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#02537a] focus:ring-1 focus:ring-[#02537a] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          <button
            onClick={() => router.push("/admin/courses")}
            className="w-full rounded-full bg-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:w-auto"
          >
            ← Back to Courses
          </button>

          <button
            onClick={() =>
              router.push(
                `/admin/chapters/add-chapters?course_id=${courseId}&course=${courseName}`,
              )
            }
            className="w-full rounded-full bg-[#02537a] px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 sm:w-auto"
          >
            + Add Chapter
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

      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead>Order</TableHead>
              <TableHead className="!text-left">Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {chapters.length > 0 ? (
              chapters.map((chapter: any) => (
                <TableRow
                  key={chapter.id}
                  className="text-center text-base font-medium text-dark dark:text-white"
                >
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() =>
                      router.push(
                        `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                      )
                    }
                  >
                    Chapter{chapter.order}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer !text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() =>
                      router.push(
                        `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                      )
                    }
                  >
                    {chapter.title}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() =>
                      router.push(
                        `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                      )
                    }
                  >
                    {chapter.content?.slice(0, 50)}...
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() =>
                      router.push(
                        `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                      )
                    }
                  >
                    {chapter.title}
                  </TableCell>
                  <TableCell className="text-center">
                    {chapter.images?.length > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMedia({
                            type: "image",
                            items: chapter.images,
                          });
                          setShowMediaModal(true);
                        }}
                        className="text-blue-600 underline"
                      >
                        View Images
                      </button>
                    ) : (
                      <span>---</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {chapter.videos?.length > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMedia({
                            type: "video",
                            items: chapter.videos,
                          });
                          setShowMediaModal(true);
                        }}
                        className="text-green-600 underline"
                      >
                        View Videos
                      </button>
                    ) : (
                      <span>---</span>
                    )}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() =>
                      router.push(
                        `/admin/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                      )
                    }
                  >
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    }).format(new Date(chapter.createdAt))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <button
                          ref={(el: any) =>
                            (buttonRefs.current[chapter.id] = el)
                          }
                          onClick={(e) => toggleDropdown(e, chapter.id)}
                          className="flex items-center justify-center rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                          title="Actions"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No chapters found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Dropdown rendered outside the table but positioned relative to buttons */}
        {activeDropdown && (
          <div
            ref={dropdownRef}
            className="fixed w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={getDropdownPosition()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              <button
                onClick={() => {
                  handleEdit(activeDropdown);
                }}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Pencil size={16} className="text-blue-600" />
                Edit Chapter
              </button>

              <button
                onClick={() => handleAddLessons(activeDropdown)}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BookOpen size={16} className="text-green-600" />
                Add Lessons
              </button>

              <button
                onClick={() => handleAddMCQs(activeDropdown)}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FileQuestion size={16} className="text-purple-600" />
                Add MCQs
              </button>

              <button
                onClick={() => handleDelete(activeDropdown)}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Trash2 size={16} />
                Delete Chapter
              </button>
            </div>
          </div>
        )}
      </div>

      {chapters.length > 0 && (
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer rounded-xl bg-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer rounded-xl bg-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
