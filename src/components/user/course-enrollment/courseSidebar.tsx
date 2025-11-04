import {
  CheckCircle,
  PlayCircle,
  BarChart3,
  Download,
  User,
  Star,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  courseData: any;
  statistics: any;
  userData: any; // Add this
  isEnrolled: boolean;
  enrolling: boolean;
  enrollmentStatus: any;
  onEnroll: () => void;
  onContinueLearning: () => void;
  onViewProgress: () => void;
  courseId: any;
}

export default function CourseSidebar({
  courseData,
  statistics,
  userData, // Add this
  isEnrolled,
  enrolling,
  enrollmentStatus,
  onEnroll,
  onContinueLearning,
  onViewProgress,
  courseId,
}: CourseSidebarProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDuration = statistics.total_duration || 0;

  return (
    <div className="space-y-6">
      {/* Enrollment Card */}
      <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {isEnrolled ? (
          <>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                You're Enrolled!
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Continue your learning journey
              </div>
            </div>

            <button
              onClick={onContinueLearning}
              className="mb-3 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Continue Learning
            </button>

            <button
              onClick={onViewProgress}
              className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View Progress
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {courseData.price_type === "free"
                  ? "Free"
                  : `$${courseData.price}`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {courseData.price_type === "free"
                  ? "Free forever"
                  : "One-time payment"}
              </div>
            </div>

            {enrollmentStatus === "success" && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Successfully enrolled!
              </div>
            )}

            {enrollmentStatus && enrollmentStatus !== "success" && (
              <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                {enrollmentStatus}
              </div>
            )}

            {!courseData.is_active ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              >
                Coming Soon
              </button>
            ) : (
              <button
                onClick={onEnroll}
                disabled={enrolling || !statistics.has_content}
                className={cn(
                  "w-full rounded-lg px-6 py-3 font-medium text-white transition-colors",
                  enrolling || !statistics.has_content
                    ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700",
                )}
              >
                {enrolling
                  ? "Enrolling..."
                  : !statistics.has_content
                    ? "Content Preparing"
                    : "Enroll Now"}
              </button>
            )}
          </>
        )}

        <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Chapters</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {statistics.total_chapters || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lessons</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {statistics.total_lessons || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">MCQs</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {statistics.total_mcqs || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Duration</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDuration(totalDuration)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Level</span>
            <span className="font-medium text-gray-900 dark:text-white">
              All Levels
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Access</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Lifetime
            </span>
          </div>
        </div>

        {/* Quick Actions for Enrolled Users */}
        {isEnrolled && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() =>
                  (window.location.href = `/user/courses/learn?id=${courseId}`)
                }
                className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <PlayCircle className="h-4 w-4" />
                Resume Learning
              </button>
              <button
                onClick={onViewProgress}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <BarChart3 className="h-4 w-4" />
                View Progress
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="h-4 w-4" />
                Download Resources
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructor Info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
          Instructor
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white">
            {courseData.creator?.username?.charAt(0) || "I"}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {courseData.creator.username}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Course Instructor
            </div>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
          Course Stats
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Enrolled
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {courseData.enrollment_count || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Rating
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {courseData.ratings || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(courseData.updatedAt).toLocaleDateString()}
            </span>
          </div>
          {isEnrolled && userData && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Your Progress
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {Math.round(userData.progress || 0)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Intro Video Card in Sidebar - Only shown if video exists */}
      {courseData.intro_video && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
            Introduction Video
          </h3>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              controls
              className="h-full w-full"
              poster={courseData.image}
              preload="metadata"
            >
              <source src={courseData.intro_video} type="video/mp4" />
              <source src={courseData.intro_video} type="video/webm" />
              <source src={courseData.intro_video} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Get started with this course introduction
          </p>
        </div>
      )}
    </div>
  );
}
