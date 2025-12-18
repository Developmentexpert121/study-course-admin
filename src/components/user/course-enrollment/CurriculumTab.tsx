"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  CheckCircle,
  Clock3,
  FileVideo,
  CheckSquare,
  FileText,
  BookOpen,
  Star,
  Target,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumTabProps {
  chapters: any[];
  statistics: any;
  isEnrolled: boolean;
  courseId: string;
}

export default function CurriculumTab({
  chapters,
  statistics,
  isEnrolled,
  courseId,
}: CurriculumTabProps) {
  const router = useRouter();
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  // FIXED: Add state to track which chapters have expanded MCQs
  const [expandedMCQs, setExpandedMCQs] = useState<number[]>([]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  // FIXED: Toggle MCQ expansion
  const toggleMCQs = (chapterId: number) => {
    setExpandedMCQs((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <FileVideo className="h-4 w-4 text-blue-500" />;
      case "mcq":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      case "mcq":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  const isChapterLocked = (chapter: any) => {
    return chapter.locked || chapter.user_progress?.locked;
  };

  const isContentLocked = (content: any, chapter: any) => {
    if (isChapterLocked(chapter)) {
      return true;
    }
    return content.locked || false;
  };

  const calculateChapterProgress = (chapter: any) => {
    if (!isEnrolled) return 0;

    const totalLessons = chapter.lessons?.length || 0;
    const totalMCQs = chapter.mcqs?.length || 0;
    const totalItems = totalLessons + totalMCQs;

    if (totalItems === 0) return 0;

    let completedItems = 0;

    completedItems +=
      chapter.lessons?.filter((lesson: any) => lesson.completed).length || 0;

    if (chapter.user_progress?.mcq_passed) {
      completedItems += totalMCQs;
    }

    return Math.round((completedItems / totalItems) * 100);
  };

  const isMCQCompleted = (mcq: any, chapter: any) => {
    return chapter.user_progress?.mcq_passed || false;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200 dark:bg-gray-700";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Section */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Course Curriculum
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Structured learning path with interactive content
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center lg:grid-cols-4">
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.total_chapters || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Chapters
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.total_lessons || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Lessons
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statistics.total_mcqs || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Quizzes
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatDuration(statistics.total_duration || 0)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Duration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {sortedChapters.map((chapter: any) => {
          const chapterProgress = calculateChapterProgress(chapter);
          const locked = isChapterLocked(chapter);
          const isExpanded = expandedChapters.includes(chapter.id);
          const areMCQsExpanded = expandedMCQs.includes(chapter.id);

          const totalItems =
            (chapter.lessons?.length || 0) + (chapter.mcqs?.length || 0);
          const completedItems = isEnrolled
            ? (chapter.lessons?.filter((l: any) => l.completed).length || 0) +
              (chapter.user_progress?.mcq_passed
                ? chapter.mcqs?.length || 0
                : 0)
            : 0;

          // FIXED: Get limited MCQs for display
          const displayedMCQs = areMCQsExpanded
            ? chapter.mcqs
            : chapter.mcqs?.slice(0, 5) || [];
          const hasMoreMCQs = chapter.mcqs?.length > 5;

          return (
            <div
              key={chapter.id}
              className={cn(
                "group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg",
                locked
                  ? "border-gray-300 bg-gray-50/50 dark:border-gray-600 dark:bg-gray-800/30"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
                isExpanded && "ring-2 ring-blue-100 dark:ring-blue-900/30",
              )}
            >
              {/* Chapter Header */}
              <button
                onClick={() => !locked && toggleChapter(chapter.id)}
                disabled={locked}
                className={cn(
                  "flex w-full items-center justify-between p-6 transition-all duration-200",
                  locked
                    ? "cursor-not-allowed bg-gray-50/50 text-gray-400 dark:bg-gray-800/30 dark:text-gray-500"
                    : "dark:hover:bg-gray-750 bg-white hover:bg-gray-50 dark:bg-gray-800",
                  isExpanded && "bg-blue-50 dark:bg-blue-900/10",
                )}
              >
                <div className="flex flex-1 items-start gap-4">
                  {/* Chapter Number/Icon */}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                      locked
                        ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        : chapterProgress === 100
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                    )}
                  >
                    {locked ? (
                      <Lock className="h-5 w-5" />
                    ) : chapterProgress === 100 ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      chapter.order
                    )}
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 text-left">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {chapter.title}
                      </h3>
                      {locked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                      {isEnrolled && chapterProgress === 100 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileVideo className="h-4 w-4" />
                        {chapter.lessons?.length || 0} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckSquare className="h-4 w-4" />
                        {chapter.mcqs?.length || 0} quizzes
                      </span>
                      {chapter.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-4 w-4" />
                          {formatDuration(chapter.duration)}
                        </span>
                      )}
                      {isEnrolled && chapterProgress > 0 && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          {chapterProgress}% complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress and Chevron */}
                <div className="flex items-center gap-4">
                  {isEnrolled && chapterProgress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            getProgressColor(chapterProgress),
                          )}
                          style={{ width: `${chapterProgress}%` }}
                        />
                      </div>
                      <span className="min-w-[40px] text-sm font-medium text-gray-700 dark:text-gray-300">
                        {chapterProgress}%
                      </span>
                    </div>
                  )}

                  {!locked && (
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                        isExpanded
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600",
                      )}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {!locked && isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
                  {/* Progress Status */}
                  {isEnrolled && (
                    <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-4 dark:from-blue-900/20 dark:to-green-900/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              chapterProgress === 100
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                            )}
                          >
                            {chapterProgress === 100 ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Clock3 className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {chapterProgress === 100
                                ? "Chapter Completed! 🎉"
                                : "Continue Learning"}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {chapterProgress === 100
                                ? "You've completed all content in this chapter"
                                : `Progress: ${chapterProgress}% - ${completedItems} of ${totalItems} items completed`}
                            </div>
                          </div>
                        </div>

                        {chapterProgress < 100 && (
                          <button
                            onClick={() =>
                              router.push(
                                `/user/courses/learn/?id=${courseId}`,
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                          >
                            <PlayCircle className="h-4 w-4" />
                            {completedItems === 0
                              ? "Start Chapter"
                              : "Continue"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Items */}
                  <div className="mb-6">
                    <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Chapter Content ({totalItems} items)
                    </h4>
                    <div className="space-y-3">
                      {/* Lessons */}
                      {chapter.lessons
                        ?.sort(
                          (a: any, b: any) => (a.order || 0) - (b.order || 0),
                        )
                        .map((content: any) => {
                          const contentLocked = isContentLocked(
                            content,
                            chapter,
                          );
                          const isCompleted = content.completed;

                          return (
                            <div
                              key={`lesson-${content.id}`}
                              className={cn(
                                "flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md",
                                contentLocked
                                  ? "border-gray-300 bg-gray-50/50 text-gray-400 dark:border-gray-600 dark:bg-gray-800/30"
                                  : isCompleted
                                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                    : getContentTypeColor(content.type),
                              )}
                            >
                              <div className="flex flex-1 items-center gap-4">
                                <div className="flex items-center gap-3">
                                  {contentLocked ? (
                                    <Lock className="h-5 w-5 text-gray-400" />
                                  ) : isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    getContentTypeIcon(content.type)
                                  )}
                                  <div>
                                    <div
                                      className={cn(
                                        "font-medium",
                                        contentLocked && "text-gray-400",
                                        isCompleted &&
                                          "text-green-700 dark:text-green-300",
                                        !contentLocked &&
                                          !isCompleted &&
                                          "text-gray-900 dark:text-white",
                                      )}
                                    >
                                      {content.title}
                                      {contentLocked && " (Locked)"}
                                    </div>
                                    {content.description && (
                                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {content.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {content.duration > 0 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDuration(content.duration)}
                                  </span>
                                )}

                                {!contentLocked &&
                                  content.type === "lesson" &&
                                  content.is_preview && (
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                      Preview
                                    </span>
                                  )}
                              </div>
                            </div>
                          );
                        })}

                      {/* MCQs - Limited to 5 initially */}
                      {displayedMCQs
                        ?.sort((a: any, b: any) => (a.id || 0) - (b.id || 0))
                        .map((content: any) => {
                          const contentLocked = isContentLocked(
                            content,
                            chapter,
                          );
                          const isCompleted = isMCQCompleted(content, chapter);

                          return (
                            <div
                              key={`mcq-${content.id}`}
                              className={cn(
                                "flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md",
                                contentLocked
                                  ? "border-gray-300 bg-gray-50/50 text-gray-400 dark:border-gray-600 dark:bg-gray-800/30"
                                  : isCompleted
                                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                    : getContentTypeColor("mcq"),
                              )}
                            >
                              <div className="flex flex-1 items-center gap-4">
                                <div className="flex items-center gap-3">
                                  {contentLocked ? (
                                    <Lock className="h-5 w-5 text-gray-400" />
                                  ) : isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    getContentTypeIcon("mcq")
                                  )}
                                  <div>
                                    <div
                                      className={cn(
                                        "font-medium",
                                        contentLocked && "text-gray-400",
                                        isCompleted &&
                                          "text-green-700 dark:text-green-300",
                                        !contentLocked &&
                                          !isCompleted &&
                                          "text-gray-900 dark:text-white",
                                      )}
                                    >
                                      {content.question}
                                      {contentLocked && " (Locked)"}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                      Multiple Choice Quiz
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {!contentLocked && content.points && (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    {content.points} pts
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {/* Show More/Less Button for MCQs */}
                      {hasMoreMCQs && (
                        <button
                          onClick={() => toggleMCQs(chapter.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white p-4 text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {areMCQsExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Show Less Quizzes
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show {chapter.mcqs.length - 5} More Quizzes
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {isEnrolled && totalItems > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          router.push(
                            `/user/courses/learn/${courseId}?chapter=${chapter.id}`,
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                      >
                        <PlayCircle className="h-5 w-5" />
                        {chapterProgress === 100
                          ? "Review Chapter"
                          : "Start Learning"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedChapters.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            No chapters available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The course curriculum is being prepared and will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}
