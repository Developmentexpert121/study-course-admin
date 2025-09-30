"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { SearchIcon, Calendar, BookOpen, Play, Trash2, CheckCircle, Award } from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function EnrolledCourses({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [role, setRole] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);
  const [loading, setLoading] = useState(true);



  // Fetch enrolled courses for the specific user
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const targetUserId = Cookies.get("userId");

      if (!targetUserId) {
        console.error("User ID is required to fetch enrolled courses");
        return;
      }

      const query = new URLSearchParams();
      query.append("userId", targetUserId);
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);

      const res = await api.get(`enroll?${query.toString()}`);

      if (res.success) {
        setEnrollments(res.data.data.enrollments);
        setTotalPages(res.data.data.totalPages || 1);

      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    setRole(Cookies.get("role"));
  }, [search, page]);

  const handleCourseClick = (courseId: number) => {
    router.push(`/user-panel/courses/${courseId}/chapter`);
  };



  const unenrollFromCourse = async (courseId: number) => {


    try {
      const userId = Cookies.get("userId");

      const res = await api.delete(`enroll/course/unenroll?user_id=${userId}&course_id=${courseId}`);

      if (res.success) {
        toasterSuccess("Unenrolled successfully", 2000, "unenroll");
        fetchEnrolledCourses(); // refresh list
      } else {
        console.error("Unenroll failed:", res);
      }
    } catch (error) {
      console.error("Unenroll error:", error);
    }
  };






  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const calculateProgress = (course: any) => {
    // Placeholder - update based on your actual progress data
    return 0;
  };

  if (loading) {
    return (
      <div className={cn("rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark", className)}>
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            coding Question 
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Continue your learning journey
          </p>
        </div>

       
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {enrollments.length > 0 ? (
          enrollments.map((enrollment: any) => {
            const course = enrollment.course;
            const progress = enrollment.progress.progress_percentage;



            return (
              <div
                key={enrollment.enrollment_id}
                onClick={()=> router.push(`/user-panel/code/chapter-code?courseId=${course.id}`)}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 cursor-pointer"              >
                {/* Course Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {progress}% Complete
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  {/* Enrollment Date */}
                  <div className="mb-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    Enrolled on {formatDate(enrollment.enrolled_at)}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {truncateText(course.description || '', 100)}
                  </p>

                  {/* Progress Bar */}
                 

                  {/* Action Buttons */}
              
                </div>
    </div>
  );
})
        ) : (
  <div className="col-span-full py-12 text-center">
    <div className="mx-auto max-w-md">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        No enrolled courses
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {search ? 'No courses match your search' : 'You haven\'t enrolled in any courses yet'}
      </p>
     
    </div>
  </div>
)}
      </div >

  {/* Pagination */ }
{
  enrollments.length > 0 && totalPages > 1 && (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {enrollments.length} enrolled courses
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && <span className="px-2">...</span>}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  )
}
    </div >
  );
}