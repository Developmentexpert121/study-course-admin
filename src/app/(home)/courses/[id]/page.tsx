// app/courses/[courseId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import {
  Star,
  Clock,
  Users,
  PlayCircle,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Award,
  FileText,
  Download,
  MessageCircle,
} from "lucide-react";
import { getDecryptedItem } from "@/utils/storageHelper";

// Real API function to fetch course details
const fetchCourseDetails = async (id: string) => {
  console.log("33333##################");
  try {
    const userId = getDecryptedItem("user_id"); // Get user ID if logged in
    const token = getDecryptedItem("token"); // Get token if needed for auth

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    // Build URL with user_id parameter if available
    let url = `${baseUrl}/api/courses/${id}/full-details`;
    if (userId) {
      url += `?user_id=${userId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

const CourseDetailPage = () => {
  console.log("CourseDetailPage component rendering");
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  console.log("courseId", courseId);

  const name: any = getDecryptedItem("name");
  const role: any = getDecryptedItem("role");
  const userId: any = getDecryptedItem("user_id");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("useEffect triggered, courseId:", courseId);

    const loadCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting to fetch course details...");

        const response = await fetchCourseDetails(courseId);
        console.log("API Response:", response);

        if (response.success) {
          setCourse(response.data.course);
          console.log("Course data set successfully");
        } else {
          setError(response.message || "Course not found");
          console.log("API returned error:", response.message);
        }
      } catch (err) {
        console.error("Error in loadCourseDetails:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
        console.log("Loading set to false");
      }
    };

    if (courseId) {
      loadCourseDetails();
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }
  }, [courseId]);

  const handleEnroll = () => {
    if (!name) {
      router.push("/auth/login");
      return;
    }

    // Handle enrollment logic here
    // This would typically make an API call to enroll the user
    alert(`Enrolled in ${course?.title} successfully!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your existing email submission logic
  };

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
    }
    return `${mins}m`;
  };

  // Transform backend data to frontend format
  const transformCourseData = (courseData: any) => {
    if (!courseData) return null;

    // Calculate total lessons from chapters
    const totalLessons =
      courseData.chapters?.reduce((total: number, chapter: any) => {
        return total + (chapter.lessons?.length || 0);
      }, 0) || 0;

    // Calculate total duration from lessons
    const totalDuration =
      courseData.chapters?.reduce((total: number, chapter: any) => {
        const chapterDuration =
          chapter.lessons?.reduce((lessonTotal: number, lesson: any) => {
            return lessonTotal + (lesson.duration || 0);
          }, 0) || 0;
        return total + chapterDuration;
      }, 0) || 0;

    // Transform chapters to curriculum format
    const curriculum =
      courseData.chapters?.map((chapter: any) => ({
        section: chapter.title,
        lessons:
          chapter.lessons?.map((lesson: any) => ({
            title: lesson.title,
            duration: formatDuration(lesson.duration),
            type: "video",
            free: lesson.is_preview || false,
          })) || [],
      })) || [];

    return {
      ...courseData,
      // Ensure we have fallback values for all required fields
      title: courseData.title || "Untitled Course",
      subtitle: courseData.subtitle || "",
      description: courseData.description || "No description available",
      category: courseData.category || "Uncategorized",
      additional_categories: courseData.additional_categories || [],
      image: courseData.image || "/images/course-placeholder.jpg",
      intro_video: courseData.intro_video || null,
      creator: courseData.creator || "Unknown Instructor",
      price: courseData.price || "0.00",
      price_type: courseData.price_type || "free",
      duration: formatDuration(totalDuration),
      features: courseData.features || [
        "Lifetime Access",
        "Certificate of Completion",
        "Project Files",
      ],
      ratings: courseData.ratings || 0,
      enrolled_students: courseData.enrollment_count || 0,
      lessons: totalLessons,
      level: "Beginner", // You might want to add this to your model
      language: "English", // You might want to add this to your model
      last_updated:
        new Date(courseData.updatedAt).toLocaleDateString() || "Unknown",
      requirements: ["Basic computer knowledge", "Internet connection"],
      learning_outcomes: [
        "Master the core concepts",
        "Build practical projects",
        "Gain valuable skills",
      ],
      curriculum,
      reviews: courseData.reviews || [
        {
          id: 1,
          user: "Student",
          rating: courseData.ratings || 4,
          comment: "Great course with comprehensive content!",
          date: new Date().toLocaleDateString(),
          avatar: "/images/user2.png",
        },
      ],
    };
  };

  const transformedCourse = transformCourseData(course);
  const isFreeCourse =
    transformedCourse?.price_type === "free" ||
    Number(transformedCourse?.price) === 0;

  console.log(
    "Current state - loading:",
    loading,
    "error:",
    error,
    "course:",
    !!transformedCourse,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header name={name} role={role} />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/4 rounded bg-gray-300"></div>
            <div className="mb-8 h-96 rounded bg-gray-300"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="h-6 rounded bg-gray-300"></div>
                <div className="h-6 rounded bg-gray-300"></div>
                <div className="h-6 w-3/4 rounded bg-gray-300"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 rounded bg-gray-300"></div>
                <div className="h-12 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transformedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header name={name} role={role} />
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="mx-auto max-w-md">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              {error || "Course Not Found"}
            </h1>
            <p className="mb-8 text-gray-600">
              {error
                ? error
                : "The course you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header name={name} role={role} />

      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push("/courses")}
              className="flex items-center hover:text-blue-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Courses
            </button>
            <span>/</span>
            <span className="font-medium text-gray-900">
              {transformedCourse.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {transformedCourse.title}
              </h1>
              <p className="mb-6 text-xl text-gray-600">
                {transformedCourse.subtitle}
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(transformedCourse.ratings || 0)
                            ? "fill-current text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {transformedCourse.ratings?.toFixed(1)} (
                    {transformedCourse.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-1 h-4 w-4" />
                  {transformedCourse.enrolled_students?.toLocaleString()}{" "}
                  students
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  {transformedCourse.duration}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {transformedCourse.lessons} lessons
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center">
                  <img
                    src="/images/user2.png"
                    alt={transformedCourse.creator}
                    className="mr-3 h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Created by</p>
                    <p className="text-gray-600">{transformedCourse.creator}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-gray-300 p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg border border-gray-300 p-2 text-gray-400 hover:text-red-500">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={transformedCourse.image}
                    alt={transformedCourse.title}
                    className="h-48 w-full rounded-t-xl object-cover"
                  />
                  <div className="absolute left-4 top-4">
                    {isFreeCourse ? (
                      <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                        FREE
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    {isFreeCourse ? (
                      <div className="text-3xl font-bold text-green-600">
                        Free
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ${Number(transformedCourse.price).toFixed(2)}
                        </span>
                        {transformedCourse.original_price && (
                          <span className="text-lg text-gray-500 line-through">
                            $
                            {Number(transformedCourse.original_price).toFixed(
                              2,
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="mb-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    {isFreeCourse ? "Enroll Now" : "Buy Now"}
                  </button>

                  <p className="mb-6 text-center text-sm text-gray-600">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      This course includes:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <PlayCircle className="mr-2 h-4 w-4 text-blue-600" />
                        {transformedCourse.duration} on-demand video
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                        {transformedCourse.lessons} lessons
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Download className="mr-2 h-4 w-4 text-blue-600" />
                        Downloadable resources
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Award className="mr-2 h-4 w-4 text-blue-600" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                        Lifetime access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                {["overview", "curriculum", "reviews", "instructor"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 px-1 py-4 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Course Description */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    Description
                  </h2>
                  <p className="leading-relaxed text-gray-700">
                    {transformedCourse.description}
                  </p>
                </div>

                {/* What You'll Learn */}
                {transformedCourse.learning_outcomes && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                      What You'll Learn
                    </h2>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {transformedCourse.learning_outcomes.map(
                        (outcome: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-gray-700">{outcome}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {transformedCourse.requirements && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                      Requirements
                    </h2>
                    <ul className="space-y-2">
                      {transformedCourse.requirements.map(
                        (requirement: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <div className="mr-3 h-2 w-2 rounded-full bg-gray-400"></div>
                            {requirement}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Course Features */}
                {transformedCourse.features && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                      Course Features
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {transformedCourse.features.map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center rounded-lg bg-gray-50 p-4"
                          >
                            <CheckCircle className="mr-3 h-5 w-5 text-blue-600" />
                            <span className="font-medium text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {transformedCourse.curriculum?.map(
                    (section: any, sectionIndex: number) => (
                      <div
                        key={sectionIndex}
                        className="rounded-lg border border-gray-200"
                      >
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                          <h3 className="font-semibold text-gray-900">
                            {section.section}
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {section.lessons?.map(
                            (lesson: any, lessonIndex: number) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between px-6 py-4"
                              >
                                <div className="flex items-center">
                                  <PlayCircle className="mr-3 h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700">
                                    {lesson.title}
                                  </span>
                                  {lesson.free && (
                                    <span className="ml-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                                      Free
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {lesson.duration}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Student Reviews
                </h2>
                <div className="space-y-6">
                  {transformedCourse.reviews?.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="mr-3 h-10 w-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review.user}
                            </h4>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-current text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}

                  {(!transformedCourse.reviews ||
                    transformedCourse.reviews.length === 0) && (
                    <div className="py-8 text-center">
                      <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-600">
                        No reviews yet. Be the first to review this course!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  About the Instructor
                </h2>
                <div className="rounded-lg bg-gray-50 p-6">
                  <div className="flex items-start">
                    <img
                      src="/images/user2.png"
                      alt={transformedCourse.creator}
                      className="mr-4 h-16 w-16 rounded-full"
                    />
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {transformedCourse.creator}
                      </h3>
                      <p className="mb-4 text-gray-600">
                        Experienced instructor with expertise in{" "}
                        {transformedCourse.category}
                        and related technologies.
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          <span>
                            {transformedCourse.ratings?.toFixed(1) || 4.5}{" "}
                            Instructor Rating
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award className="mr-1 h-4 w-4 text-blue-600" />
                          <span>Expert Instructor</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-green-600" />
                          <span>
                            {transformedCourse.enrolled_students}+ Students
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Stats */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Course Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium text-gray-900">
                      {transformedCourse.level || "Beginner"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {transformedCourse.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium text-gray-900">
                      {transformedCourse.lessons}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium text-gray-900">
                      {transformedCourse.language || "English"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-900">
                      {transformedCourse.last_updated}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {transformedCourse.category}
                  </span>
                  {transformedCourse.additional_categories?.map(
                    (cat: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                      >
                        {cat}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        loading={false}
      />
    </div>
  );
};

export default CourseDetailPage;
