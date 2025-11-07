// components/course-learn/CourseContentSidebar.tsx
import React, { useState } from "react";
import ChapterAccordion from "./ChapterAccordion";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Target,
  Award,
  Play,
} from "lucide-react";

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
  const [mcqResults, setMcqResults] = useState<{ [chapterId: number]: any }>(
    {},
  );

  const handleMCQResult = (chapterId: number, result: any) => {
    setMcqResults((prev) => ({
      ...prev,
      [chapterId]: result,
    }));
  };

  const handleStartMCQ = (chapter: any) => {
    onStartMCQ(chapter);
  };

  const getChapterProgress = (chapter: any) => {
    if (!courseProgress?.chapters || !Array.isArray(courseProgress.chapters)) {
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

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="h-full border-l border-slate-200 bg-white/90 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
      <div className="flex h-full flex-col">
        {/* Enhanced Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-500 to-purple-600 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Course Content</h2>
              <p className="text-sm text-blue-100">Your learning journey</p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Your Progress
              </span>
              <span className="text-sm font-bold text-white">
                {progressPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-white/30 backdrop-blur-sm">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-300" />
                <span className="text-blue-100">
                  {completedLessons}/{totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-purple-300" />
                <span className="text-blue-100">
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
                  mcqResults={mcqResults[chapter.id]}
                  defaultOpen={index === 0}
                  selectedLesson={selectedLesson}
                />
              ))}
          </div>
        </div>

        {/* Enhanced Quick Stats Footer */}
        <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-slate-700/50">
              <div className="flex justify-center">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {course.chapters.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Chapters
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-slate-700/50">
              <div className="flex justify-center">
                <Target className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {totalLessons}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Lessons
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-slate-700/50">
              <div className="flex justify-center">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {formatDuration(totalDuration)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
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
