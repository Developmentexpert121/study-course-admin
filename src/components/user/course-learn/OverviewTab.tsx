// components/course-learn/OverviewTab.tsx
import React from "react";
import {
  BookOpen,
  Clock,
  Users,
  Target,
  CheckCircle2,
  PlayCircle,
  Award,
  BarChart3,
} from "lucide-react";

interface OverviewTabProps {
  course: any;
  courseProgress: any | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  course,
  courseProgress,
}) => {
  // Calculate progress statistics
  const totalLessons =
    course?.chapters?.reduce(
      (total: number, chapter: any) => total + (chapter.lessons?.length || 0),
      0,
    ) || 0;

  const completedLessons =
    courseProgress?.chapters?.reduce(
      (total: number, chapter: any) =>
        total + (chapter.progress?.completed_lessons || 0),
      0,
    ) || 0;

  const totalChapters = course?.chapters?.length || 0;
  const completedChapters = courseProgress?.completed_chapters || 0;

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalDuration =
    course?.chapters?.reduce(
      (total: number, chapter: any) => total + (chapter.duration || 0),
      0,
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <BarChart3 className="h-5 w-5" />
          Your Learning Progress
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Overall Progress */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Overall Progress
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {progressPercentage}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Lessons Completed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedLessons}/{totalLessons}
                </p>
              </div>
            </div>
          </div>

          {/* Chapters Completed */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Chapters Completed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedChapters}/{totalChapters}
                </p>
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Duration
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatDuration(totalDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5" />
          Course Description
        </h3>
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: course?.description || "<p>No description available.</p>",
          }}
        />
      </div>

      {/* Course Features */}
      {course?.features && course.features.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Award className="h-5 w-5" />
            What You'll Learn
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {course.features.map((feature: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div
                  className="prose prose-slate dark:prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: feature }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Statistics */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Users className="h-5 w-5" />
          Course Statistics
        </h3>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {course?.statistics?.total_chapters || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Chapters
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {course?.statistics?.total_lessons || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lessons
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {course?.statistics?.total_mcqs || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Assessments
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {course?.statistics?.total_enrolled || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enrolled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
