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
  userData: any;
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
  userData,
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
      {/* Enrollment Card - Only this one has sticky and high z-index */}
      <div className=" top-6 z-40 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
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
              className="mb-3 w-full rounded-lg bg-gradient-to-r from-primary to-[#8b5cf6] px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue Learning
            </button>

            <button
              onClick={onViewProgress}
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View Progress
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 text-center p-4 bg-[#885bf54f]">
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
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Successfully enrolled!
              </div>
            )}

            {enrollmentStatus && enrollmentStatus !== "success" && (
              <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                {enrollmentStatus}
              </div>
            )}
            <div className="px-6">
              {!courseData.is_active ? (


                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                >
                  Coming Soon
                </button>
              ) : (
                <button
                  onClick={onEnroll}
                  disabled={enrolling || !statistics.has_content}
                  className={cn(
                    "w-full rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    enrolling || !statistics.has_content
                      ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                      : " flex justify-center items-center gap-1 bg-gradient-to-r from-primary to-[#8b5cf6] hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500",
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap w-5 h-5 mr-2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                  {enrolling
                    ? "Enrolling..."
                    : !statistics.has_content
                      ? "Content Preparing"
                      : "Enroll Now"}
                </button>

              )}
            </div>
          </>

        )}
          {/* Course Details */}


        <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700 p-6">
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
              {courseData.level || "All Levels"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Access</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Lifetime
            </span>
          </div>
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
                className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <PlayCircle className="h-4 w-4" />
                Resume Learning
              </button>
              <button
                onClick={onViewProgress}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <BarChart3 className="h-4 w-4" />
                View Progress
              </button>
            </div>
          </div>
        )}
        {/* Instructor Info - No z-index, normal flow */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
            Instructor
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white shadow-sm">
              {courseData.creator?.username?.charAt(0)?.toUpperCase() || "I"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-gray-900 dark:text-white">
                {courseData.creator?.username || "Instructor"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Course Instructor
              </div>
            </div>
          </div>
          {courseData.creator?.bio && (
            <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
              {courseData.creator.bio}
            </p>
          )}
        </div>

        {/* Course Stats - No z-index, normal flow */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
            Course Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex gap-1 items-center"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-4 h-4 "><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Enrolled
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {courseData.enrollment_count?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between ">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex gap-1 items-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star h-4 w-4 text-gray-600 " aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                Rating
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {courseData.ratings
                    ? courseData.ratings?.average_rating.toFixed(1)
                    : "0.0"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 text-gray-600 "><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                Last Updated
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {courseData.updatedAt
                  ? new Date(courseData.updatedAt).toLocaleDateString()
                  : "N/A"}
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

        {/* Intro Video Card - No z-index, normal flow */}
        {courseData.intro_video && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Introduction Video
              </h3>
            </div>
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
