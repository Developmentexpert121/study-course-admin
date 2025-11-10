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
  const courseId = params.id;
  const userId: any = getDecryptedItem("userId");

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

  const scrollToProgress = () => {
    // First switch to the progress tab
    setActiveTab("progress");

    // Then scroll to the progress section after a small delay to ensure tab is rendered
    setTimeout(() => {
      const progressSection = document.getElementById("progress-section");
      if (progressSection) {
        progressSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Optional: Add a highlight effect
        progressSection.style.transition = "all 0.3s ease";
        progressSection.style.backgroundColor = "rgba(59, 130, 246, 0.05)";

        setTimeout(() => {
          progressSection.style.backgroundColor = "transparent";
        }, 2000);
      }
    }, 100);
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

  const courseData = course;
  const statistics = courseData.statistics || {};
  const userData = courseData.user_data || {};

  // Get wishlist status from course data or use the hook
  const isInWishlistStatus =
    userData?.is_in_wishlist || isInWishlist(course.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        isEnrolled={isEnrolled}
        isInWishlist={isInWishlistStatus}
        onBack={() => router.back()}
        onWishlistToggle={handleWishlistToggle}
        wishlistLoading={wishlistLoading}
        courseTitle={courseData?.title}
      />

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
            onViewProgress={scrollToProgress} // Updated to use scroll function
            courseId={courseId}
          />
        </div>
      </div>
    </div>
  );
}
