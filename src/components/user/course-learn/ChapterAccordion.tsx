// components/course-learn/ChapterAccordion.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle2,
  PlayCircle,
  FileText,
  Clock,
  Award,
} from "lucide-react";
import LessonItem from "./LessonItem";
import MCQSection from "./MCQSection";

const ChapterAccordion: React.FC<any> = ({
  chapter,
  chapterProgress,
  onLessonClick,
  onStartMCQ,
  defaultOpen = true,
  selectedLesson,
  mcqResults,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Use chapter.locked from API response, not chapterProgress
  const locked = chapter.locked; // ✅ This comes from your API
  const completed = chapter.completed || false;
  const mcqPassed = chapter?.mcq_passed || false;
  const lessonCompleted = chapter?.lesson_completed || false;

  const completedLessons = chapterProgress?.completed_lessons || 0;
  const totalLessons = chapter.lessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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
      className={`mb-3 rounded-xl border transition-all duration-200 ${
        locked
          ? "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
          : completed
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-blue-200 bg-white dark:border-gray-600 dark:bg-gray-800"
      }`}
    >
      {/* Chapter Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between p-4 text-left transition-all hover:bg-opacity-80 ${
          locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        }`}
        disabled={locked}
      >
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${
              locked
                ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                : completed
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
            }`}
          >
            {locked ? (
              <Lock className="h-3 w-3" />
            ) : completed ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <PlayCircle className="h-3 w-3" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  locked
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Chapter {chapter.order}
              </span>
              {completed && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <Award className="h-3 w-3" />
                  Completed
                </span>
              )}
            </div>
            <h3
              className={`font-medium ${
                locked
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {chapter.title}
            </h3>

            {/* Chapter Stats */}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(chapter.duration || 0)}</span>
              </div>
              {!locked && !completed && (
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chevron Icon */}
        {!locked && (
          <div className="text-gray-400 transition-transform duration-200">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        )}
      </button>

      {/* Chapter Content */}
      {isOpen && !locked && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-600">
          {/* Lessons */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Lessons ({completedLessons}/{totalLessons})
            </h4>
            <div className="space-y-2">
              {chapter.lessons
                .sort((a: any, b: any) => a.order - b.order)
                .map((lesson: any) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    locked={locked}
                    completed={lesson.completed}
                    isSelected={selectedLesson?.lesson.id === lesson.id}
                    onLessonClick={() => onLessonClick(chapter, lesson)}
                  />
                ))}
            </div>
          </div>

          {/* MCQ Section */}
          {chapter.mcqs.length > 0 && (
            <MCQSection
              chapter={chapter}
              chapterProgress={chapterProgress}
              onStartMCQ={() => onStartMCQ(chapter)}
              mcqResults={mcqResults}
            />
          )}
        </div>
      )}

      {/* Locked Message */}
      {locked && (
        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Lock className="h-4 w-4" />
            <span>Complete previous chapter to unlock</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterAccordion;
