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
  BarChart2,
  Search,
  FileBadge,
  BookOpen,
} from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer";

interface CoursesListProps {
  basePath: string; // "admin" or "super-admin"
  className?: string;
}

export default function CoursesList({ basePath, className }: CoursesListProps) {
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

      // Add view_type for super-admin
      const url =
        basePath === "super-admin"
          ? `course/list?view_type=admin&${query.toString()}`
          : `course/list?${query.toString()}`;

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
        router.push(`/${basePath}/courses/edit-course?id=${id}`);
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
      toasterError("Failed to delete course");
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>, courseId: number) => {
    const newStatus = event.target.value;

    // Call your API or state update function here to save the new status
    handleToggleStatus(courseId, newStatus); // Replace with your actual function to update status

  };

  const handleToggleStatus = async (id: number, status: string) => {
    try {
      const res = await api.put(`course/${id}/status`, {
        status
      });

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
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
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
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          icon: <FileText className="h-3 w-3" />,
        };
      default:
        return {
          label: "Unknown",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
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
        "grid overflow-auto rounded-[10px] px-7.5 pb-4 pt-7.5 dark:bg-gray-dark ",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <FileBadge className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
            Courses
          </h1>
          <p className="mt-2 text-gray-600 dark:text-white">
            View and manage all Courses
          </p>
        </div>

        {/* Add Course Button */}
        <button
          onClick={() => router.push(`/${basePath}/courses/add-courses`)}
          className="rounded-lg bg-[#02517b] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#013d5b] sm:w-auto"
        >
          + Add Course
        </button>
      </div>



         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Courses
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {courses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {
                  courses.filter(
                    (course: { status: string }) => course.status === "active",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
              <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Draft
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {
                  courses.filter(
                    (course: { status: string }) => course.status === "draft",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
              <EyeOff className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Inactive
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {
                  courses.filter(
                    (course: { status: string }) =>
                      course.status === "inactive",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchCourses();
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "active" | "inactive" | "draft",
              )
            }
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={fetchCourses}
              className="inline-flex items-center justify-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </button>

            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || statusFilter !== "all") && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Active filters:</span>
            {search && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Search: "{search}"
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Status: {statusFilter}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Stats Cards */}
   

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
                      `/${basePath}/chapters?course=${course.title}&course_id=${course.id}`,
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
                  <TableCell className="py">
                    <div className="flex justify-center">
                      {course.course_readiness.has_chapters && course.course_readiness.has_lessons && course.course_readiness.has_mcqs ? (
                        // Dropdown for changing status instead of button
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={course.status} // assuming `course.status` holds the current status
                            onChange={(e) => {
                              handleStatusChange(e, course.id); // Call your status change handler
                            }}
                            className="rounded-full p-1.5 transition-colors bg-white text-sm font-medium text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                            title="Select status"
                          >
                            <option value="inactive">Inactive</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            {/* Add more status options as needed */}
                          </select>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                              "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                              "border border-gray-200 dark:border-gray-700",
                            )}
                          >
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <span>Incomplete</span>
                          </div>
                          <span className="max-w-[120px] text-center text-xs leading-tight text-gray-500 dark:text-gray-400">
                            {!course.course_readiness.has_chapters
                              ? "Add chapters to activate"
                              : !course.course_readiness.has_lessons
                                ? "Add lessons to activate"
                                : !course.course_readiness.has_mcqs
                                  ? "Add MCQs to activate"
                                  : "Ready to activate"}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Creator */}
                  <TableCell className="py-2">
                    {course.creator?.username?.charAt(0).toUpperCase() +
                      course.creator?.username?.slice(1).toLowerCase()}
                  </TableCell>

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
                        className="text-blue-600 hover:text-white"
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

                      <button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/${basePath}/rating?course_id=${course.id}&course_title=${encodeURIComponent(course.title)}`,
                          );
                        }}
                        title="Manage Ratings"
                      >
                        <BarChart2 size={18} />
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
