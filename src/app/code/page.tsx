"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import {  SearchIcon } from "lucide-react";
// import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // Adjusted for card layout


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


const handleCourseClick = (courseId:any) => {
  router.push(`code/code-questions-page?course_id=${courseId}`);
};
 



  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      )}
    >
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Courses
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-300 bg-gray-50 py-2 px-4 text-sm text-gray-700 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          </div>

          {/* Add Course Button */}
         
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course:any) => (
            
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Course Image */}
              {course.image ? (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Course Content */}
              <div className="p-6">
                {/* Header with Title and Actions */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-dark dark:text-white line-clamp-2 flex-1">
                    {course.title}
                  </h3>
                </div>

                {/* Course Details */}
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {course.description.split('\n').slice(0, 3).map((line: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 mb-1">
                          {line.trim().startsWith("✅") && (
                            <span className="text-green-500 text-xs mt-0.5">✅</span>
                          )}
                          <span className="text-xs">
                            {line.replace(/^✅\s*/, "").slice(0, 60)}
                            {line.replace(/^✅\s*/, "").length > 60 ? "..." : ""}
                          </span>
                        </div>
                      ))}
                      {course.description.split('\n').length > 3 && (
                        <span className="text-xs text-gray-500">...</span>
                      )}
                    </div>
                  </div>

                  {/* Category and Status */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Category:
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {course.category}
                      </p>
                    </div>
                    
                  </div>

                  {/* Creator */}
                  <div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Creator:
                    </span>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {course.creator}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full",
                        course.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {search || statusFilter !== "all" 
              ? "No courses found matching your criteria." 
              : "No courses found."}
          </div>
          <button
            onClick={() => router.push("/courses/add-courses")}
            className="mt-4 rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            + Add Your First Course
          </button>
        </div>
      )}

      {/* Pagination */}
      {courses.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}