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
} from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function Mcq({ className }: any) {
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
      setChapterName(res.data.data.data[0].chapter.title);

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
      `/super-admin/mcq/edit-mcq?id=${id}&course_id=${courseId}&chapter_id=${chapterId}&name=${courseName}`,
    );
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this MCQ?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`mcq/${id}`);
      if (response.success) {
        toasterSuccess("MCQ Deleted Successfully", 2000);
        fetchMcq();
      }
    } catch (error) {
      console.error("Failed to delete MCQ:", error);
    }
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
                  `/super-admin/chapters?course=${courseName}&course_id=${courseId}`,
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
                  `/super-admin/mcq/add-mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
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
                        className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          item.is_active
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
                          onClick={() => handleDelete(item.id)}
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
                            `/super-admin/mcq/add-mcq?chapter_id=${chapterId}&course_id=${courseId}&name=${courseName}`,
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
