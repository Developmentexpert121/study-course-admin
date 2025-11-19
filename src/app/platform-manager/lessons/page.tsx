"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function AddChapter() {
  const router = useRouter();
  const api = useApiClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);
      if (statusFilter === "active") query.append("active", "true");
      if (statusFilter === "inactive") query.append("active", "false");

      const res = await api.get(`course/list?${query.toString()}`);
      if (res.success) {
        setCourses(res?.data?.data?.courses || []);
        setTotalPages(res.data?.data?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter, page]);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      )}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Courses in which you have to add Lessons{" "}
        </h2>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course: any) => (
            <div
              key={course.id}
              onClick={() =>
                router.push(
                  `/platform-manager/lessons/all-chapters?course=${encodeURIComponent(course.title)}&course_id=${course.id}`,
                )
              }
              className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {course.image ? (
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                  <span className="text-lg font-semibold text-white">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="line-clamp-2 flex-1 text-lg font-semibold text-dark dark:text-white">
                    {course.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {course.description
                        .split("\n")
                        .slice(0, 3)
                        .map((line: any, idx: any) => (
                          <div
                            key={idx}
                            className="mb-1 flex items-start gap-2"
                          >
                            {line.trim().startsWith("✅") && (
                              <span className="mt-0.5 text-xs text-green-500">
                                ✅
                              </span>
                            )}
                            <span className="text-xs">
                              {line.replace(/^✅\s*/, "").slice(0, 60)}
                              {line.replace(/^✅\s*/, "").length > 60
                                ? "..."
                                : ""}
                            </span>
                          </div>
                        ))}
                      {course.description.split("\n").length > 3 && (
                        <span className="text-xs text-gray-500">...</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Category:
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {course.category}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Creator:
                    </span>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {course.creator}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-600">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        course.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      )}
                    >
                      {course.is_active ? "Active" : "Inactive"}
                    </span>

                    {/* Created Date */}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(course.createdAt))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            {search || statusFilter !== "all"
              ? "No courses found matching your criteria."
              : "No courses found."}
          </div>
        </div>
      )}

      {/* Pagination */}
      {courses.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
