"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
    Pencil,
    Trash2,
    ToggleRight,
    ToggleLeft,
    ArrowLeft,
    Plus,
    AlertTriangle,
    X,
    RefreshCw,
} from "lucide-react";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";

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
                MCQ to delete:
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

export default function McqList({ basePath, className }: { basePath: string, className?: string }) {
    const router = useRouter();
    const [mcq, setMcq] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [chaptername, setChapterName] = useState("");
    const [limit] = useState(5);
    const searchParams = useSearchParams();
    const courseId = searchParams.get("course_id");
    const chapterId = searchParams.get("chapter_id");
    const courseName = searchParams.get("name");
    const api = useApiClient();

    // Delete Modal State
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        mcqId: number | null;
        mcqQuestion: string;
    }>({
        isOpen: false,
        mcqId: null,
        mcqQuestion: "",
    });

    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchMcq();
    }, [page, courseId, chapterId]);

    const fetchMcq = async () => {
        try {
            setLoading(true);
            let url = `mcq?page=${page}&limit=${limit}`;

            if (courseId) url += `&course_id=${courseId}`;
            if (chapterId) url += `&chapter_id=${chapterId}`;

            const res = await api.get(url);

            const mcqs = res.data?.data?.data || [];
            const total = res.data?.data?.pagination?.total || 0;
            
            if (mcqs.length > 0 && mcqs[0].chapter) {
                setChapterName(mcqs[0].chapter.title);
            }

            setMcq(mcqs);
            setTotal(total);
        } catch (err) {
            console.error("Failed to fetch MCQs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(
            `/${basePath}/mcq/edit-mcq?id=${id}&course_id=${courseId}&chapter_id=${chapterId}&name=${courseName}`,
        );
    };

    // Open delete modal
    const openDeleteModal = (mcqId: number, mcqQuestion: string) => {
        setDeleteModalState({
            isOpen: true,
            mcqId,
            mcqQuestion,
        });
    };

    // Close delete modal
    const closeDeleteModal = () => {
        if (!deleteLoading) {
            setDeleteModalState({
                isOpen: false,
                mcqId: null,
                mcqQuestion: "",
            });
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deleteModalState.mcqId) return;

        setDeleteLoading(true);
        try {
            const response = await api.delete(`mcq/${deleteModalState.mcqId}`);
            if (response.success) {
                toasterSuccess("MCQ Deleted Successfully", 2000);
                
                // If this was the last item on the page and we're not on page 1, go back a page
                if (mcq.length === 1 && page > 1) {
                    setPage((prev) => prev - 1);
                } else {
                    fetchMcq();
                }
                closeDeleteModal();
            }
        } catch (error) {
            console.error("Failed to delete MCQ:", error);
            toasterError("Failed to delete MCQ");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDelete = (id: number, question: string) => {
        openDeleteModal(id, question);
    };

    const handleToggleStatus = async (id: number, newStatus: boolean) => {
        try {
            const res = await api.put(`mcq/${id}/status`, { is_active: newStatus });
            if (res.success) {
                toasterSuccess(
                    `MCQ ${newStatus ? "activated" : "deactivated"} successfully`,
                    2000,
                );
                fetchMcq();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(dateString));
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "N/A";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const totalPages = Math.ceil(total / limit);

    // Loading skeleton
    if (loading && mcq.length === 0) {
        return (
            <div
                className={cn(
                    "rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark",
                    className,
                )}
            >
                <div className="mb-6 h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark",
                className,
            )}
        >
            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                title="Delete MCQ"
                message="This action cannot be undone. The MCQ will be permanently deleted from the system."
                itemName={deleteModalState.mcqQuestion}
                confirmText="Delete MCQ"
                cancelText="Cancel"
                loading={deleteLoading}
            />

            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            MCQs Management
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                            {courseName && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    Course: {courseName}
                                </span>
                            )}
                            {chaptername && (
                                <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    Chapter: {chaptername}
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Total: {total} MCQs
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={() =>
                                router.push(
                                    `/${basePath}/chapters?course=${courseName}&course_id=${courseId}`,
                                )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Chapters
                        </button>

                        <button
                            onClick={() =>
                                router.push(
                                    `/${basePath}/mcq/add-mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
                                )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add MCQ
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Question
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Correct Answer
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {mcq.length > 0 ? (
                                mcq.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                            <div
                                                className="max-w-[300px] cursor-help"
                                                title={item.question}
                                            >
                                                {truncateText(item.question, 60)}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                            <div
                                                className="max-w-[200px] cursor-help"
                                                title={item.answer}
                                            >
                                                {truncateText(item.answer, 40)}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${item.is_active
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(item.id, !item.is_active)
                                                    }
                                                    className="flex items-center gap-1"
                                                    title={item.is_active ? "Deactivate" : "Activate"}
                                                >
                                                    {item.is_active ? (
                                                        <ToggleRight className="h-4 w-4" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4" />
                                                    )}
                                                    {item.is_active ? "Active" : "Inactive"}
                                                </button>
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(item.createdAt)}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="rounded p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-900/20"
                                                    title="Edit MCQ"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item.id, item.question)}
                                                    className="rounded p-1 text-red-600 transition hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-900/20"
                                                    title="Delete MCQ"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="h-32 px-4 py-3 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <div className="mb-2 text-lg font-medium">
                                                No MCQs Found
                                            </div>
                                            <p className="mb-4 text-sm">
                                                Get started by creating your first MCQ
                                            </p>
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/${basePath}/mcq/add-mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add First MCQ
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {(page - 1) * limit + 1} to{" "}
                            {Math.min(page * limit, total)} of {total} entries
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                Previous
                            </button>

                            <button
                                onClick={() =>
                                    setPage((prev) => (page < totalPages ? prev + 1 : prev))
                                }
                                disabled={page >= totalPages}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}