// components/course-learn/CourseContentSidebar.tsx
import React, { useState } from "react";
import ChapterAccordion from "./ChapterAccordion";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Target,
  Award,
  BarChart3,
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

  console.log(course, "===course data");

  const handleMCQResult = (chapterId: number, result: any) => {
    setMcqResults((prev) => ({
      ...prev,
      [chapterId]: result,
    }));
  };

  const handleStartMCQ = (chapter: any) => {
    onStartMCQ(chapter);
  };

  // Calculate progress directly from course data
  const calculateProgressFromCourse = () => {
    if (!course || !course.chapters) {
      return {
        totalChapters: 0,
        completedChapters: 0,
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
        totalDuration: 0,
      };
    }

    const totalChapters = course.chapters.length;

    // Calculate completed chapters (completed or mcq_passed)
    const completedChapters = course.chapters.filter(
      (chapter: any) => chapter.completed || chapter.mcq_passed,
    ).length;

    // Calculate total and completed lessons
    let totalLessons = 0;
    let completedLessons = 0;
    let totalDuration = 0;

    course.chapters.forEach((chapter: any) => {
      const chapterLessons = chapter.lessons || [];
      totalLessons += chapterLessons.length;
      totalDuration += chapter.duration || 0;

      // Count completed lessons in this chapter
      const chapterCompletedLessons = chapterLessons.filter(
        (lesson: any) => lesson.completed,
      ).length;
      completedLessons += chapterCompletedLessons;
    });

    // Use user_data.progress if available, otherwise calculate from lessons
    const progressPercentage =
      course.user_data?.progress ||
      (totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0);

    return {
      totalChapters,
      completedChapters,
      totalLessons,
      completedLessons,
      progressPercentage,
      totalDuration,
    };
  };

  const {
    totalChapters,
    completedChapters,
    totalLessons,
    completedLessons,
    progressPercentage,
    totalDuration,
  } = calculateProgressFromCourse();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="h-full border-l border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex h-full flex-col">
        {/* Enhanced Header */}
        <div className="border-b border-slate-200 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-6 dark:border-slate-700">
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
                Overall Progress
              </span>
              <span className="text-sm font-bold text-white">
                {progressPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-white/30 backdrop-blur-sm">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 shadow-lg shadow-green-500/25 transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-300" />
                <span className="text-blue-100">
                  {completedLessons}/{totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3 w-3 text-purple-300" />
                <span className="text-blue-100">
                  {completedChapters}/{totalChapters} chapters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                Learning Path
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Complete chapters in order to unlock new content
              </p>
            </div>

            {course.chapters
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((chapter: any, index: any) => (
                <ChapterAccordion
                  key={chapter.id}
                  chapter={chapter}
                  chapterProgress={null} // We don't need separate progress since it's in the chapter object
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
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-white/80 p-3 backdrop-blur-sm dark:bg-slate-700/80">
              <div className="flex justify-center">
                <Target className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {completedLessons}/{totalLessons}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Lessons Done
              </div>
            </div>
            <div className="rounded-lg bg-white/80 p-3 backdrop-blur-sm dark:bg-slate-700/80">
              <div className="flex justify-center">
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {progressPercentage}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Progress
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Total: {formatDuration(totalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentSidebar;
