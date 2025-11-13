// components/course-learn/ChapterAccordion.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  FileText,
  Clock,
  Award,
  Star,
} from "lucide-react";

interface ChapterAccordionProps {
  chapter: any;
  chapterProgress: any;
  onLessonClick: (chapter: any, lesson: any) => void;
  onStartMCQ: (chapter: any) => void;
  mcqResults: any;
  defaultOpen: boolean;
  selectedLesson: { chapter: any; lesson: any } | null;
}

const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapter,
  chapterProgress,
  onLessonClick,
  onStartMCQ,
  mcqResults,
  defaultOpen,
  selectedLesson,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isChapterCompleted = chapter.completed || chapter.mcq_passed;
  const isChapterLocked = chapter.locked && !isChapterCompleted;

  const completedLessons = chapterProgress?.completed_lessons || 0;
  const totalLessons = chapter.lessons?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getChapterStatus = () => {
    if (isChapterCompleted) return "completed";
    if (completedLessons > 0) return "in-progress";
    return "not-started";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-400";
      case "in-progress":
        return "bg-blue-500 border-blue-400";
      default:
        return "bg-gray-300 border-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white" />;
      case "in-progress":
        return <div className="h-2 w-2 animate-pulse rounded-full bg-white" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-white" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div
      className={`mb-4 rounded-xl border transition-all duration-300 ${
        isChapterCompleted
          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
          : isChapterLocked
            ? "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"
            : "border-blue-200 bg-white dark:border-blue-800 dark:bg-slate-800/80"
      }`}
    >
      {/* Chapter Header */}
      <div
        className={`flex cursor-pointer items-center justify-between p-4 transition-all ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        } ${
          isChapterCompleted
            ? "bg-green-100/50 dark:bg-green-900/30"
            : isChapterLocked
              ? "bg-gray-100/50 dark:bg-gray-800/50"
              : "bg-blue-50 dark:bg-blue-900/20"
        }`}
        onClick={() => !isChapterLocked && setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 items-center gap-3">
          {/* Status Indicator */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${getStatusColor(getChapterStatus())}`}
          >
            {getStatusIcon(getChapterStatus())}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-semibold ${
                  isChapterCompleted
                    ? "text-green-800 dark:text-green-300"
                    : isChapterLocked
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-slate-900 dark:text-white"
                }`}
              >
                Chapter {chapter.order}
              </h3>
              {isChapterCompleted && (
                <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 dark:bg-green-800">
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Completed
                  </span>
                </div>
              )}
            </div>
            <p
              className={`truncate text-sm font-medium ${
                isChapterLocked
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {chapter.title}
            </p>

            {/* Progress and Duration */}
            <div className="mt-1 flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <FileText className="h-3 w-3" />
                <span>
                  {completedLessons}/{totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(chapter.duration || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Circle */}
          {!isChapterCompleted && !isChapterLocked && (
            <div className="relative h-8 w-8">
              <svg className="h-8 w-8 -rotate-90 transform" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-blue-500"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (progressPercentage / 100) * 88}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                {progressPercentage}%
              </span>
            </div>
          )}

          {isChapterLocked ? (
            <Lock className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              } ${
                isChapterCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          )}
        </div>
      </div>

      {/* Chapter Content */}
      {isOpen && !isChapterLocked && (
        <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-700">
          {/* Lessons List */}
          {chapter.lessons?.map((lesson: any, index: number) => {
            const isSelected = selectedLesson?.lesson?.id === lesson.id;
            const isLessonLocked = lesson.locked && !lesson.completed;

            return (
              <div
                key={lesson.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${
                  isSelected
                    ? "border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30"
                    : isLessonLocked
                      ? "cursor-not-allowed bg-gray-50 dark:bg-gray-800/50"
                      : "bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50"
                }`}
                onClick={() =>
                  !isLessonLocked && onLessonClick(chapter, lesson)
                }
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    lesson.completed
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : isSelected
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      isLessonLocked
                        ? "text-gray-400 dark:text-gray-500"
                        : lesson.completed
                          ? "text-green-700 dark:text-green-300"
                          : isSelected
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {lesson.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lesson.duration_display ||
                      formatDuration(lesson.duration || 0)}
                  </p>
                </div>

                {isLessonLocked && <Lock className="h-4 w-4 text-gray-400" />}
              </div>
            );
          })}

          {chapter.mcqs && chapter.mcqs.length > 0 && (
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                onClick={() => onStartMCQ(chapter)}
                disabled={
                  !chapter.progress?.all_lessons_completed ||
                  !chapter.user_progress?.can_attempt_mcq ||
                  chapter.mcq_passed
                }
                className={`w-full rounded-lg px-4 py-3 font-semibold transition-all ${
                  chapter.mcq_passed
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : !chapter.progress?.all_lessons_completed ||
                        !chapter.user_progress?.can_attempt_mcq
                      ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>
                    {chapter.mcq_passed
                      ? "Assessment Passed ✓"
                      : "Take Chapter Assessment"}
                  </span>
                </div>

                {/* Status indicator */}
                {!chapter.progress?.all_lessons_completed && (
                  <div className="mt-1 text-xs opacity-75">
                    Complete all lessons to unlock
                  </div>
                )}

                {chapter.progress?.all_lessons_completed &&
                  !chapter.user_progress?.can_attempt_mcq && (
                    <div className="mt-1 text-xs opacity-75">
                      Assessment unlocking...
                    </div>
                  )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterAccordion;
