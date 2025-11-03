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
import { useEffect, useState } from "react";
import {
  Pencil,
  SearchIcon,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer";

export default function Courses({ className }: any) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");
  const [courses, setCourses] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const api = useApiClient();

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCourses();
  }, [page, search, statusFilter]);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();

      if (search) query.append("search", search);
      if (statusFilter === "active") query.append("status", "active");
      if (statusFilter === "inactive") query.append("status", "inactive");
      if (statusFilter === "draft") query.append("status", "draft");
      query.append("page", page.toString());
      query.append("limit", limit.toString());
      const url = `course/list?${query.toString()}`;
      const res = await api.get(url);
      if (res.success) {
        setCourses(res.data?.data?.courses || []);
        setTotalPages(res.data?.data?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      if (id) {
        router.push(`/admin/courses/edit-course?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?",
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`course/${id}`);
      if (response.success) {
        toasterSuccess("Course Deleted Successfully", 2000, "id");

        if (courses.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchCourses();
        }
      }
    } catch (error) {
      console.log("Failed to delete course:", error);
      toasterError("Failed to delete course");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.put(`course/${id}/status`, {});

      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "id");
        fetchCourses();
      } else {
        toasterError(
          res.error?.message || "Add chapter then you can activate this course",
          3000,
          "status",
        );
      }
    } catch (err) {
      console.log("🚨 Failed to update status", err);
      toasterError("Failed to update status");
    }
  };

  // Get status badge based on course status
  const getStatusBadge = (course: any) => {
    const status = course.status;

    switch (status) {
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "inactive":
        return {
          label: "Inactive",
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          icon: <EyeOff className="h-3 w-3" />,
        };
      case "draft":
        return {
          label: "Draft",
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          icon: <FileText className="h-3 w-3" />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          icon: <FileText className="h-3 w-3" />,
        };
    }
  };

  // Get toggle button display based on current status
  const getToggleButton = (course: any) => {
    const status = course.status;

    switch (status) {
      case "active":
        return {
          icon: <Eye className="h-5 w-5 text-green-600" />,
          title: "Deactivate Course",
          color: "text-green-600 hover:text-green-800",
        };
      case "inactive":
        return {
          icon: <EyeOff className="h-5 w-5 text-red-600" />,
          title: "Activate Course",
          color: "text-red-600 hover:text-red-800",
        };
      case "draft":
        return {
          icon: <FileText className="h-5 w-5 text-yellow-600" />,
          title: "Activate Course",
          color: "text-yellow-600 hover:text-yellow-800",
        };
      default:
        return {
          icon: <FileText className="h-5 w-5 text-gray-600" />,
          title: "Toggle Status",
          color: "text-gray-600 hover:text-gray-800",
        };
    }
  };

  return (
    <div
      className={cn(
        "grid overflow-auto rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mobile-buttons mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Heading */}
        <h2 className="list text-center text-xl font-bold text-gray-900 dark:text-white">
          All Courses List
        </h2>

        {/* Controls Section */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-nowrap sm:items-center">
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "active" | "inactive" | "draft",
                )
              }
              className="active-btn w-full appearance-none rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => router.push("/admin/courses/add-courses")}
            className="w-full rounded-full bg-[#02517b] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#013d5b] sm:w-auto"
          >
            + Add Course
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Creator Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.length > 0 ? (
            courses.map((course: any) => {
              const statusBadge = getStatusBadge(course);
              const toggleButton = getToggleButton(course);

              return (
                <TableRow
                  onClick={() =>
                    router.push(
                      `/admin/chapters?course=${course.title}&course_id=${course.id}`,
                    )
                  }
                  className="cursor-pointer text-center text-base font-medium text-dark dark:text-white"
                  key={course.id}
                >
                  {/* Title */}
                  <TableCell className="py-6 !text-left">
                    <span className="font-medium">{course.title}</span>
                    {course.subtitle && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-white">
                        {course.subtitle}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="py-2 text-left">
                    <div className="text-center text-sm text-gray-700 dark:text-white">
                      <SafeHtmlRenderer
                        html={course.description}
                        maxLength={100}
                        className="text-sm leading-6"
                        showMoreButton={false}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="py-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {course.category}
                    </span>
                  </TableCell>

                  {/* Status Badge with Toggle Button */}
                  <TableCell className="py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.color}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                      
                      {/* Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(course.id);
                        }}
                        className={`rounded-full p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${toggleButton.color}`}
                        title={toggleButton.title}
                      >
                        {toggleButton.icon}
                      </button>
                    </div>
                  </TableCell>

                  {/* Creator */}
                  <TableCell className="py-2">{course.creator_name.charAt(0).toUpperCase() + course.creator_name.slice(1).toLowerCase() }</TableCell>

                  <TableCell className="py-2">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-16 w-24 rounded-md border object-contain"
                      />
                    ) : (
                      <span className="text-gray-500">---</span>
                    )}
                  </TableCell>

                  <TableCell className="py-2">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(course.createdAt))}
                  </TableCell>

                  <TableCell className="py-2">
                    <div className="flex items-center justify-center gap-3">
                      {/* Edit Button */}
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(course.id);
                        }}
                        title="Edit Course"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(course.id);
                        }}
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {courses.length > 0 && (
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