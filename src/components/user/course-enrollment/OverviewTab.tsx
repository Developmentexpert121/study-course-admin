import {
  BookOpen,
  Video,
  FileQuestion,
  Clock,
  Award,
  FileText,
  Trophy,
} from "lucide-react";

interface OverviewTabProps {
  statistics: any;
  userData: any;
  isEnrolled: boolean;
  courseData: any;
}

export default function OverviewTab({
  statistics,
  userData,
  isEnrolled,
  courseData,
}: OverviewTabProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDuration = statistics.total_duration_display || "Not specified";

  // Helper function to safely get progress values from the actual API structure
  const getProgressData = () => {
    if (!isEnrolled || !userData) {
      return {
        chaptersCompleted: 0,
        lessonsCompleted: 0,
        overallProgress: 0,
      };
    }

    // Calculate progress from chapters data
    let chaptersCompleted = 0;
    let lessonsCompleted = 0;
    let totalLessons = 0;

    if (courseData.chapters && Array.isArray(courseData.chapters)) {
      courseData.chapters.forEach((chapter: any) => {
        if (chapter.user_progress?.completed) {
          chaptersCompleted++;
        }

        // Count lessons in this chapter
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          totalLessons += chapter.lessons.length;

          // Count completed lessons in this chapter
          chapter.lessons.forEach((lesson: any) => {
            if (lesson.completed) {
              lessonsCompleted++;
            }
          });
        }
      });
    }

    // Calculate overall progress percentage
    const totalChapters = statistics.total_chapters || 0;
    const overallProgress =
      totalChapters > 0
        ? Math.round((chaptersCompleted / totalChapters) * 100)
        : userData.progress || 0; // Fallback to userData.progress if available

    return {
      chaptersCompleted,
      lessonsCompleted,
      overallProgress,
      totalLessons,
    };
  };

  const progressData = getProgressData();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        About This Course
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <BookOpen className="mr-3 h-5 w-5 text-blue-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Chapters
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_chapters || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Video className="mr-3 h-5 w-5 text-green-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Lessons
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_lessons || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <FileQuestion className="mr-3 h-5 w-5 text-purple-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total MCQs
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_mcqs || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Clock className="mr-3 h-5 w-5 text-orange-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duration
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {totalDuration}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Award className="mr-3 h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              All Levels
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <FileText className="mr-3 h-5 w-5 text-red-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Price
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {courseData.price_type === "free"
                ? "Free"
                : `$${parseFloat(courseData.price).toFixed(2)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Progress for Enrolled Users */}
      {isEnrolled && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900 dark:text-green-100">
            <Trophy className="h-5 w-5" />
            Your Learning Journey
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {progressData.chaptersCompleted}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Chapters Done
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {progressData.lessonsCompleted}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Lessons Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {progressData.overallProgress}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Overall Progress
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalDuration}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Duration
              </div>
            </div>
          </div>

          {/* Progress bar for visual representation */}
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm text-green-700 dark:text-green-300">
              <span>Course Progress</span>
              <span>{progressData.overallProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-green-200 dark:bg-green-700">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressData.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Course Description */}
      {courseData.description && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Course Description
          </h4>
          <div
            className="prose max-w-none text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: courseData.description }}
          />
        </div>
      )}

      {/* Course Features */}
      {courseData.features && courseData.features.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            What You'll Get
          </h4>
          <div className="prose max-w-none text-gray-600 dark:text-gray-300">
            {courseData.features.map((feature: string, index: number) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: feature }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
