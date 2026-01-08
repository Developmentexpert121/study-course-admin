import Image from "next/image";
import { User, Calendar, Users, Star, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseHeaderProps {
  courseData: any;
  isEnrolled: boolean;
  userData: any;
}

export default function CourseHeader({
  courseData,
  isEnrolled,
  userData,
}: CourseHeaderProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  console.log("this is the detail about the course details", courseData)
  // Safe progress calculation - userData.progress is a number, not an object
  const progress = userData?.progress || 0;
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card">
      <div className="relative h-64 md:h-80">
        {courseData.image && (

          <Image
            src={courseData.image}
            alt={courseData.title}
            fill
            className="object-cover"
          />

        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="inline-flex items-center rounded-full border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-[#0e234ee6] text-white font-semibold px-3 py-1">UI/UX</div>
          <div className="inline-flex items-center rounded-full border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-primary text-white font-semibold px-3 py-1">6 Months</div>
        </div>

      </div>
      <div className="p-6 space-y-4">

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {courseData.category}
            </span>
            {isEnrolled && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Enrolled
              </span>
            )}
            {!courseData.is_active && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Coming Soon
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-black font-display mb-1">
            {courseData.title}
          </h1>

          {courseData.subtitle && (
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
              {courseData.subtitle}
            </p>
          )}

          {/* Progress Bar for Enrolled Users - FIXED */}
          {isEnrolled && safeProgress > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Your Progress
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {safeProgress}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${safeProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-[#667085]">By</span>
              <User className="h-4 w-4" />
              <span>{courseData.creator.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(courseData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{courseData.enrollment_count || 0} enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{courseData.ratings || 4}</span>
            </div>
          </div>
          {/* Course Description */}
          {courseData.description && (
            <div className="prose dark:prose-invert  max-w-none mt-2">
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: courseData.description,
                }}
              />
            </div>
          )}
        </div>
      </div>



      {/* Intro Video Section - Only shown if video exists */}
      {courseData.intro_video && (
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Course Introduction Video
          </h3>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
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
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Watch the course introduction
                </span>
              </div>
              {!isEnrolled && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Free Preview
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
