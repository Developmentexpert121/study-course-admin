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
    Search,
    Trash2,
    MoreVertical,
    BookOpen,
    FileQuestion,
    CheckCircle,
    AlertTriangle,
    X,
    RefreshCw,
} from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer";

import { useDispatch, useSelector } from 'react-redux';
import {
    markChapterComplete,
    fetchCourseProgress,
    resetProgress
} from '@/store/slices/adminslice/completechapter';
import {
    DndContext,
    closestCenter,
    DraggableSyntheticListeners
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AiOutlineDrag } from "react-icons/ai";

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
          {itemName && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Chapter to delete:
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {itemName}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

type SortableRowProps = {
    id: number;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
};

function SortableRow({ id, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="text-center text-base font-medium text-dark dark:text-white"
    >
      {children(listeners)}
    </tr>
  );
}

export default function ChaptersList({ basePath }: any) {
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

    // Delete Modal State
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        chapterId: number | null;
        chapterName: string;
    }>({
        isOpen: false,
        chapterId: null,
        chapterName: "",
    });

    const [deleteLoading, setDeleteLoading] = useState(false);

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
        router.push(`/${basePath}/chapters/edit-chapters?id=${id}`);
    };

    // Open delete modal
    const openDeleteModal = (chapterId: number, chapterName: string) => {
        setActiveDropdown(null);
        setDeleteModalState({
            isOpen: true,
            chapterId,
            chapterName,
        });
    };

    // Close delete modal
    const closeDeleteModal = () => {
        if (!deleteLoading) {
            setDeleteModalState({
                isOpen: false,
                chapterId: null,
                chapterName: "",
            });
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deleteModalState.chapterId) return;

        setDeleteLoading(true);
        try {
            const response = await api.delete(`chapter/${deleteModalState.chapterId}`);
            if (response.success) {
                toasterSuccess("Chapter Deleted Successfully", 2000, "id");

                if (chapters.length === 1 && page > 1) {
                    setPage((prev) => prev - 1);
                } else {
                    if (courseId) {
                        await fetchChapters(courseId);
                    }
                }
                closeDeleteModal();
            } else {
                toasterError(response.error.code, 3000, "id");
            }
        } catch (error) {
            console.error("Failed to delete chapter:", error);
            toasterError("Failed to delete chapter");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDelete = (id: number, title: string) => {
        openDeleteModal(id, title);
    };

    const handleAddLessons = (chapterId: number) => {
        setActiveDropdown(null);
        router.push(
            `/${basePath}/lessons/list?course_id=${courseId}&chapter_id=${chapterId}`,
        );
    };

    const handleAddMCQs = (chapterId: number) => {
        setActiveDropdown(null);
        router.push(
            `/${basePath}/mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
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

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setChapters((items) => {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);

            const moved = arrayMove(items, oldIndex, newIndex);

            const reordered = moved.map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            // Persist order
            api.patch("chapter/order", {
                chapters: reordered.map(c => ({
                    id: c.id,
                    order: c.order,
                })),
            }).then(() => {
                toasterSuccess("Chapter order updated");
            }).catch(() => {
                toasterError("Failed to update order");
            });
            return reordered;
        });
    };

    return (
        <div
            className={cn(
                "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
            )}
        >
            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                title="Delete Chapter"
                message="This action cannot be undone. The chapter and all its content will be permanently deleted from the system."
                itemName={deleteModalState.chapterName}
                confirmText="Delete Chapter"
                cancelText="Cancel"
                loading={deleteLoading}
            />

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
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>

                    <button
                        onClick={() => router.push(`/${basePath}/courses`)}
                        className="w-full rounded-full bg-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:w-auto"
                    >
                        ← Back to Courses
                    </button>

                    <button
                        onClick={() =>
                            router.push(
                                `/${basePath}/chapters/add-chapters?course_id=${courseId}&course=${courseName}`,
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
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chapters.map(ch => ch.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none uppercase [&>th]:text-center">
                                    <TableHead>Order</TableHead>
                                    <TableHead className="!text-left">Title</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {chapters.length > 0 ? (
                                    chapters.map((chapter) => (
                                        <SortableRow key={chapter.id} id={chapter.id}>
                                            {(listeners: any) => (
                                                <>
                                                    <TableCell
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center justify-center gap-2 ml-2"
                                                    >
                                                        <AiOutlineDrag
                                                            {...listeners}
                                                            className="cursor-grab text-dark-500 hover:text-gray-800 mr-5"
                                                            style={{ fontSize: "26px" }}
                                                        />
                                                        {chapter.order}
                                                    </TableCell>

                                                    <TableCell
                                                        className="cursor-pointer !text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        onClick={() =>
                                                            router.push(
                                                                `/${basePath}/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                                                            )
                                                        }
                                                    >
                                                        {chapter.title}
                                                    </TableCell>

                                                    <TableCell
                                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        onClick={() =>
                                                            router.push(
                                                                `/${basePath}/lessons/list?course_id=${courseId}&chapter_id=${chapter.id}`,
                                                            )
                                                        }
                                                    >
                                                        <SafeHtmlRenderer
                                                            html={chapter.content}
                                                            maxLength={100}
                                                            showMoreButton={false}
                                                        />
                                                    </TableCell>

                                                    <TableCell>{chapter.title}</TableCell>

                                                    <TableCell>
                                                        {new Intl.DateTimeFormat("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
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
                                                </>
                                            )}
                                        </SortableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No chapters found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>

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
                                onClick={() => handleDelete(activeDropdown, chapters.find(ch => ch.id === activeDropdown)?.title || "")}
                                className="flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <Trash2 size={16} />
                                Delete Chapter
                            </button>

                            <button
                                className="flex items-center gap-3 px-4 py-3 text-left text-sm text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <CheckCircle size={16} />
                                Mark as Completed
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