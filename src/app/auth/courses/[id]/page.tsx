"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { useWishlist } from "@/hooks/useWishlist";

import PageHeader from "@/components/user/course-enrollment/pageHeader";
import CourseHeader from "@/components/user/course-enrollment/courseHeader";
import LoadingState from "@/components/user/course-enrollment/LoadingState";
import ErrorState from "@/components/user/course-enrollment/errorState";
import CourseTabs from "@/components/user/course-enrollment/CourseTabs";
import CourseSidebar from "@/components/user/course-enrollment/courseSidebar";

export default function CourseDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const api = useApiClient();

  // Use the wishlist hook
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const params = useParams();
  console.log(params,"===params")
  const courseId = params.id;
  const userId: any = getDecryptedItem("userId");
  const [menuOpen, setMenuOpen] = useState(false);
  // Fetch enrollment status
  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await api.get(
          `enroll/course/status?user_id=${userId}&course_id=${courseId}`,
        );
        if (response.data?.data?.enrolled) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error("Failed to fetch enrollment status:", err);
      }
    };

    fetchEnrollmentStatus();
  }, [userId, courseId]);

  // Fetch course data using the new API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const queryParams = userId ? `?user_id=${userId}` : "";
        const res = await api.get(
          `course/${courseId}/full-details${queryParams}`,
        );

        if (res.success) {
          setCourse(res.data?.data?.course);
        }
      } catch (err) {
        console.error("Failed to load course data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, userId]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!userId) {
      alert("Please login to add courses to wishlist");
      return;
    }

    if (!course) return;

    try {
      const isCurrentlyInWishlist = isInWishlist(course.id);

      if (isCurrentlyInWishlist) {
        await removeFromWishlist(course.id);
      } else {
        await addToWishlist(course);
      }

      // Refresh course data to get updated wishlist status
      const queryParams = userId ? `?user_id=${userId}` : "";
      const res = await api.get(
        `course/${courseId}/full-details${queryParams}`,
      );
      if (res.success) {
        setCourse(res.data?.data?.course);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const handleEnroll = async () => {
    if (!userId) {
      setEnrollmentStatus("Please log in to enroll in this course");
      return;
    }

    setEnrolling(true);
    setEnrollmentStatus(null);

    try {
      const response = await api.post("enroll", {
        user_id: userId,
        course_id: courseId,
      });

      if (response.success) {
        setEnrollmentStatus("success");
        setIsEnrolled(true);
        // Refresh course data to get updated enrollment status
        const queryParams = userId ? `?user_id=${userId}` : "";
        const res = await api.get(
          `course/${courseId}/full-details${queryParams}`,
        );
        if (res.success) {
          setCourse(res.data?.data?.course);
        }
      } else {
        setEnrollmentStatus(response.error || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentStatus("An error occurred during enrollment");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!course) {
    return <ErrorState onBack={() => router.back()} />;
  }
  const name: any = getDecryptedItem("name");
  const courseData = course;
  const statistics = courseData.statistics || {};
  const userData = courseData.user_data || {};

  // Get wishlist status from course data or use the hook
  const isInWishlistStatus =
    userData?.is_in_wishlist || isInWishlist(course.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight text-blue-600">
            <img src="/images/logo.png" className="w-[50px]" alt="Logo" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
            <a href="/" className="transition hover:text-blue-600">
              Home
            </a>
            <a href="/courses" className="text-blue-600">
              Courses
            </a>
            <a href="/#about" className="transition hover:text-blue-600">
              About
            </a>
          </nav>

          {/* Login / Sign Up */}
          {name ? (
            <div>
              {" "}
              <h1 className="font-medium text-gray-700 hover:text-blue-600">
                {name}
              </h1>{" "}
              <button
                className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black"
                onClick={() => router.push(`/user/dashboard`)}
              >
                dashboard
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-4 md:flex">
              <button
                className="font-medium text-gray-700 hover:text-blue-600"
                onClick={() => router.push("/auth/login")}
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 focus:outline-none md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t bg-white shadow-inner md:hidden">
            <nav className="flex flex-col space-y-3 px-6 py-4">
              <a href="#" className="transition hover:text-blue-600">
                Home
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Courses
              </a>
              <a href="#" className="transition hover:text-blue-600">
                About
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Contact
              </a>
              <div className="mt-3 flex gap-3">
                <button className="flex-1 rounded-full border border-blue-600 px-5 py-2 font-semibold text-blue-600 transition-all duration-300 ease-in-out hover:bg-[#02517b]hover:text-white hover:shadow-lg">
                  Login
                </button>
                <button className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            <CourseHeader
              courseData={courseData}
              isEnrolled={isEnrolled}
              userData={userData}
            />

            <CourseTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              courseData={courseData}
              statistics={statistics}
              userData={userData}
              isEnrolled={isEnrolled}
              courseId={courseId}
            />
          </div>

          {/* Right Column - Enrollment & Info */}
          <CourseSidebar
            courseData={courseData}
            statistics={statistics}
            userData={userData}
            isEnrolled={isEnrolled}
            enrolling={enrolling}
            enrollmentStatus={enrollmentStatus}
            onEnroll={handleEnroll}
            onContinueLearning={() =>
              router.push(`/user/courses/learn?id=${courseId}`)
            }
            onViewProgress={() => setActiveTab("progress")}
            courseId={courseId}
          />
        </div>
      </div>
    </div>
  );
}
