// components/course-learn/CourseContentSidebar.tsx
import React, { useState } from "react";
import ChapterAccordion from "./ChapterAccordion";
import { BookOpen, Clock, CheckCircle2, Target } from "lucide-react";

interface CourseContentSidebarProps {
  course: any;
  courseProgress: any | null;
  onLessonClick: (chapter: any, lesson: any) => void;
  onStartMCQ: (chapter: any) => void;
  selectedLesson: { chapter: any; lesson: any } | null;
}

const CourseContentSidebar: React.FC<CourseContentSidebarProps> = ({
  course,
  courseProgress,
  onLessonClick,
  onStartMCQ,
  selectedLesson,
}) => {
  // State to store MCQ results for each chapter
  const [mcqResults, setMcqResults] = useState<{ [chapterId: number]: any }>(
    {},
  );

  // Function to handle MCQ results from API
  const handleMCQResult = (chapterId: number, result: any) => {
    setMcqResults((prev) => ({
      ...prev,
      [chapterId]: result,
    }));
  };

  // Update your onStartMCQ to handle results if needed
  const handleStartMCQ = (chapter: any) => {
    // If you need to handle MCQ start logic, do it here
    onStartMCQ(chapter);
  };

  const getChapterProgress = (chapter: any) => {
    // Safe check for courseProgress structure
    if (
      !courseProgress ||
      !courseProgress.chapters ||
      !Array.isArray(courseProgress.chapters)
    ) {
      return null;
    }
    const progressChapter = courseProgress.chapters.find(
      (ch: any) => ch.id === chapter.id,
    );
    return progressChapter?.progress || null;
  };

  const totalLessons = course.chapters.reduce(
    (total: any, chapter: any) => total + chapter.lessons.length,
    0,
  );

  const completedLessons = course.chapters.reduce(
    (total: any, chapter: any) => {
      const progress: any = getChapterProgress(chapter);
      return total + (progress?.completed_lessons || 0);
    },
    0,
  );

  const totalDuration = course.chapters.reduce((total: any, chapter: any) => {
    return total + (chapter.duration || 0);
  }, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate progress percentage safely
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="h-full border-l border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-full flex-col">
        {/* Enhanced Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Course Content
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn at your own pace
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {progressPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {completedLessons}/{totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {formatDuration(totalDuration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {course.chapters
              .sort((a: any, b: any) => a.order - b.order)
              .map((chapter: any, index: any) => (
                <ChapterAccordion
                  key={chapter.id}
                  chapter={chapter}
                  chapterProgress={getChapterProgress(chapter)}
                  onLessonClick={onLessonClick}
                  onStartMCQ={handleStartMCQ}
                  mcqResults={mcqResults[chapter.id]} // Pass specific chapter results
                  defaultOpen={index === 0}
                  selectedLesson={selectedLesson}
                />
              ))}
          </div>
        </div>

        {/* Enhanced Quick Stats Footer */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex justify-center">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {course.chapters.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Chapters
              </div>
            </div>
            <div>
              <div className="flex justify-center">
                <Target className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {totalLessons}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Lessons
              </div>
            </div>
            <div>
              <div className="flex justify-center">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {formatDuration(totalDuration)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentSidebar;
