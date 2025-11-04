"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Play,
  FileText,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import { useApiClient } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  creator: string;
  created_at: string;
  duration: string;
  enrolled_students: number;
  rating: number;
  total_lessons: number;
  price: number;
  is_enrolled: boolean;
  progress?: number;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  is_completed: boolean;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  order: number;
  video_url: string;
  resources: Resource[];
  is_completed: boolean;
  is_locked: boolean;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  url: string;
}

export default function CourseEnrollmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const api = useApiClient();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`course/${courseId}`);

      if (res.success) {
        setCourse(res.data);
      } else {
        console.error("Failed to fetch course details");
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;

    try {
      setEnrolling(true);
      const res = await api.post(`course/${courseId}/enroll`, {});

      if (res.success) {
        toasterSuccess("Successfully enrolled in the course!");
        // Refresh course data to update enrollment status
        fetchCourseDetails();
      } else {
        toasterError(res.error || "Failed to enroll in the course");
      }
    } catch (err) {
      toasterError("An error occurred during enrollment");
      console.error("Enrollment error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinueLearning = () => {
    if (course) {
      router.push(`/user/courses/${course.id}/chapter`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Course Not Found
          </h2>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </button>
        </div>
      </div>

      {/* Course Hero Section */}
      <div className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="md:w-2/3">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {course.category}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {course.title}
              </h1>

              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                {course.description}
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="mr-1 h-4 w-4" />
                  {course.enrolled_students.toLocaleString()} students
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="mr-1 h-4 w-4" />
                  {course.duration}
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  {course.rating.toFixed(1)} rating
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {course.total_lessons} lessons
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {course.creator.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Created by
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.creator}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="mb-4 overflow-hidden rounded-lg shadow-md">
                <Image
                  src={course.image || "/placeholder-course.jpg"}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="h-auto w-full object-cover"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-6 shadow dark:bg-gray-700">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
                  </h3>
                </div>

                {course.is_enrolled ? (
                  <>
                    {course.progress && course.progress > 0 ? (
                      <>
                        <div className="mb-4">
                          <div className="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Your progress</span>
                            <span>{course.progress}% complete</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                              className="h-2.5 rounded-full bg-blue-600"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={handleContinueLearning}
                          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Continue Learning
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleContinueLearning}
                        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Learning
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {enrolling
                      ? "Enrolling..."
                      : course.price > 0
                        ? "Enroll Now"
                        : "Start Learning"}
                  </button>
                )}

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("curriculum")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "curriculum"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Curriculum
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              About This Course
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {course.description}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                  What You&asop;ll Learn
                </h3>
                <ul className="space-y-2">
                  {course.description
                    .split("✅")
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {item.trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Course Details
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-300">
                      Duration
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {course.duration}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-300">
                      Lessons
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {course.total_lessons}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-300">Level</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      All Levels
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-300">
                      Language
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      English
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-300">
                      Certificate
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      Yes
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Course Content
            </h2>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.chapters?.length || 0} chapters •{" "}
                    {course.total_lessons} lessons • {course.duration}
                  </span>
                </div>

                {!course.is_enrolled && (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {enrolling ? "Enrolling..." : "Enroll to Access"}
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {course.chapters?.map((chapter) => (
                  <div key={chapter.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {chapter.order}. {chapter.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.lessons.length} lessons
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                      {chapter.description}
                    </p>

                    <div className="space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center rounded-lg p-3 ${
                            lesson.is_locked && !course.is_enrolled
                              ? "bg-gray-50 opacity-60 dark:bg-gray-700"
                              : "bg-gray-50 dark:bg-gray-700"
                          }`}
                        >
                          <div className="mr-3 flex-shrink-0">
                            {lesson.is_completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : lesson.is_locked && !course.is_enrolled ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                <svg
                                  className="h-3 w-3 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <Play className="h-5 w-5 text-blue-500" />
                            )}
                          </div>

                          <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {lesson.order}. {lesson.title}
                            </h4>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="mr-1 h-3 w-3" />
                              {lesson.duration}
                              {lesson.resources.length > 0 && (
                                <>
                                  <span className="mx-2">•</span>
                                  <FileText className="mr-1 h-3 w-3" />
                                  {lesson.resources.length} resources
                                </>
                              )}
                            </div>
                          </div>

                          {lesson.is_locked && !course.is_enrolled ? (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Locked
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (course.is_enrolled) {
                                  router.push(
                                    `/user/courses/${course.id}/lessons/${lesson.id}`,
                                  );
                                }
                              }}
                              className={`text-sm font-medium ${
                                course.is_enrolled
                                  ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  : "text-gray-400"
                              }`}
                            >
                              Preview
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Student Reviews
            </h2>

            <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 text-4xl font-bold text-gray-900 dark:text-white">
                    {course.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(course.rating)
                              ? "fill-current text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Course Rating •{" "}
                      {course.enrolled_students.toLocaleString()} students
                    </p>
                  </div>
                </div>

                {course.is_enrolled && (
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    Write a Review
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Sample reviews - in a real app, these would come from the backend */}
              {[1, 2, 3].map((review) => (
                <div
                  key={review}
                  className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          U{review}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        User {review}
                      </h4>
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= 5
                                  ? "fill-current text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          2 weeks ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300">
                    This course was absolutely fantastic! The instructor
                    explained complex concepts in a way that was easy to
                    understand. The hands-on projects were particularly
                    valuable.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
