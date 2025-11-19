import { CheckCircle, Trophy, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTabProps {
  userData: any;
  chapters: any[];
  statistics: any;
}

export default function ProgressTab({
  userData,
  chapters,
  statistics,
}: ProgressTabProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDuration = statistics.total_duration || 0;

  // Sort chapters by order to ensure proper sequence (order 1 first, then 2, etc.)
  const sortedChapters = [...chapters].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  // Calculate progress statistics from backend data
  const calculateProgressStats = () => {
    // Use backend-provided data directly
    const completedChapters = sortedChapters.filter(
      (chapter) => chapter.user_progress?.completed || chapter.completed,
    ).length;

    const totalChapters = sortedChapters.length;

    // Use backend statistics for lessons
    const completedLessons = statistics.completed_lessons || 0;
    const totalLessons = statistics.total_lessons || 0;

    // Use user progress from backend
    const overallProgress = userData?.progress || 0;

    return {
      completedChapters,
      completedLessons,
      totalLessons,
      totalChapters,
      remainingChapters: totalChapters - completedChapters,
      overallProgress,
    };
  };

  const progressStats = calculateProgressStats();

  const calculateChapterProgress = (chapter: any) => {
    // Use backend progress data if available
    if (chapter.user_progress?.completed || chapter.completed) {
      return 100;
    }

    // Calculate based on chapter progress data from backend
    if (chapter.progress) {
      const totalLessons = chapter.progress.total_lessons || 0;
      const completedLessons = chapter.progress.completed_lessons || 0;

      if (totalLessons === 0) return 0;
      return Math.round((completedLessons / totalLessons) * 100);
    }

    // Fallback to calculating from lessons array
    const totalLessons = chapter.lessons?.length || 0;
    if (totalLessons === 0) return 0;

    const completedLessons =
      chapter.lessons?.filter((lesson: any) => lesson.completed)?.length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200 dark:bg-gray-600";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const getChapterStatus = (chapter: any) => {
    if (chapter.user_progress?.completed || chapter.completed) {
      return "completed";
    }
    if (chapter.user_progress?.started_at && !chapter.user_progress.completed) {
      return "in-progress";
    }
    return "not-started";
  };

  const getStatusIcon = (status: string, isLocked: boolean) => {
    if (isLocked) {
      return <Lock className="h-4 w-4 text-gray-400" />;
    }

    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default:
        return (
          <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        My Learning Progress
      </h3>

      {/* Overall Progress */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Overall Progress
        </h4>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Course Completion
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {progressStats.overallProgress}%
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{
                width: `${progressStats.overallProgress}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {progressStats.completedChapters}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapters Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {progressStats.completedLessons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lessons Finished
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {progressStats.remainingChapters}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapters Remaining
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatDuration(totalDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Duration
            </div>
          </div>
        </div>
      </div>

      {/* Chapter-wise Progress */}
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Chapter Progress
        </h4>
        <div className="space-y-4">
          {sortedChapters.map((chapter: any) => {
            const progress = calculateChapterProgress(chapter);
            const isCompleted = progress === 100;
            const status = getChapterStatus(chapter);
            const canAttemptMCQ =
              chapter.user_progress?.can_attempt_mcq ||
              chapter.progress?.can_attempt_mcq;
            const isLocked = chapter.locked || chapter.user_progress?.locked;

            return (
              <div
                key={chapter.id}
                className={cn(
                  "rounded-lg border bg-white p-4 shadow-sm transition-colors dark:bg-gray-800",
                  isCompleted
                    ? "border-green-200 dark:border-green-800"
                    : status === "in-progress"
                      ? "border-blue-200 dark:border-blue-800"
                      : "border-gray-200 dark:border-gray-700",
                  isLocked && "opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="mt-1">{getStatusIcon(status, isLocked)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Chapter {chapter.order}: {chapter.title}
                      </span>
                      {isLocked && (
                        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {chapter.progress?.completed_lessons || 0}/
                      {chapter.progress?.total_lessons ||
                        chapter.lessons?.length ||
                        0}{" "}
                      lessons • {chapter.mcqs?.length || 0} MCQs •{" "}
                      {formatDuration(chapter.duration || 0)}
                    </div>

                    {/* Chapter specific progress indicators */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chapter.progress?.all_lessons_completed && (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          All lessons completed
                        </span>
                      )}
                      {canAttemptMCQ && !isLocked && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          MCQ Available
                        </span>
                      )}
                      {chapter.user_progress?.mcq_passed && (
                        <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          <Trophy className="h-3 w-3" />
                          MCQ Passed
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {progress}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            getProgressColor(progress),
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="mt-2">
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          Chapter Completed
                        </div>
                      )}
                      {status === "in-progress" && !isCompleted && (
                        <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                          <PlayCircle className="h-4 w-4" />
                          In Progress - {progress}% complete
                        </div>
                      )}
                      {status === "not-started" && !isLocked && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Not started
                        </div>
                      )}
                      {isLocked && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Lock className="h-4 w-4" />
                          Complete previous chapter to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Learning Statistics
        </h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.total_mcqs || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total MCQs
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.passed_mcqs || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              MCQs Passed
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.total_chapters || sortedChapters.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Chapters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
