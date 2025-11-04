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

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
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
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "mcq":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const calculateChapterProgress = (chapter: any) => {
    const totalItems =
      (chapter.lessons?.length || 0) + (chapter.mcqs?.length || 0);
    if (totalItems === 0) return 0;
    return chapter.user_progress?.completed ? 100 : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course Curriculum
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {statistics.total_chapters} chapters • {statistics.total_lessons}{" "}
          lessons • {statistics.total_mcqs} MCQs
        </div>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter: any, index: number) => {
          const chapterProgress = calculateChapterProgress(chapter);
          const isChapterLocked = !isEnrolled && index > 0;

          return (
            <div
              key={chapter.id}
              className={cn(
                "overflow-hidden rounded-lg border transition-all",
                isChapterLocked
                  ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
                  : "border-gray-200 dark:border-gray-700",
              )}
            >
              <button
                onClick={() => !isChapterLocked && toggleChapter(chapter.id)}
                disabled={isChapterLocked}
                className={cn(
                  "flex w-full items-center justify-between p-4 transition-colors",
                  isChapterLocked
                    ? "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      isChapterLocked
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
                    )}
                  >
                    {isChapterLocked ? <Lock className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {chapter.title}
                      {isChapterLocked && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Locked)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{chapter.lessons?.length || 0} lessons</span>
                      <span>{chapter.mcqs?.length || 0} MCQs</span>
                      {chapter.duration > 0 && (
                        <span>{formatDuration(chapter.duration)}</span>
                      )}
                      {isEnrolled && chapterProgress > 0 && (
                        <span className="font-medium text-green-600">
                          {chapterProgress}% complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isEnrolled && chapterProgress > 0 && (
                    <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(chapterProgress),
                        )}
                        style={{ width: `${chapterProgress}%` }}
                      />
                    </div>
                  )}
                  {!isChapterLocked &&
                    (expandedChapters.includes(chapter.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ))}
                </div>
              </button>

              {!isChapterLocked && expandedChapters.includes(chapter.id) && (
                <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                  {chapter.description && (
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      {chapter.description}
                    </p>
                  )}

                  {/* Enhanced User Progress for Chapter */}
                  {isEnrolled && chapter.user_progress && (
                    <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-medium",
                              chapter.user_progress.completed
                                ? "text-green-700 dark:text-green-300"
                                : "text-blue-700 dark:text-blue-300",
                            )}
                          >
                            {chapter.user_progress.completed
                              ? "Completed"
                              : "In Progress"}
                          </span>
                          {chapter.user_progress.mcq_passed && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              MCQ Passed
                            </span>
                          )}
                        </div>
                        {!chapter.user_progress.completed && (
                          <button
                            onClick={() =>
                              router.push(
                                `/user/courses/learn/${courseId}?chapter=${chapter.id}`,
                              )
                            }
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lessons and MCQs */}
                  <div className="space-y-2">
                    {[...(chapter.lessons || []), ...(chapter.mcqs || [])]
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((content: any, contentIndex: number) => {
                        const isContentLocked = !isEnrolled && contentIndex > 0;
                        return (
                          <div
                            key={content.id}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3 transition-colors",
                              isContentLocked
                                ? "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-700/50"
                                : getContentTypeColor(content.type),
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {isContentLocked ? (
                                <Lock className="h-4 w-4 text-gray-400" />
                              ) : (
                                getContentTypeIcon(content.type)
                              )}
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  isContentLocked && "text-gray-400",
                                )}
                              >
                                {content.title}
                                {isContentLocked && " (Preview)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              {content.duration > 0 && (
                                <span>{formatDuration(content.duration)}</span>
                              )}
                              {!isContentLocked &&
                                content.type === "mcq" &&
                                content.points && (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                                    {content.points} pts
                                  </span>
                                )}
                              {!isContentLocked &&
                                content.type === "lesson" &&
                                content.is_preview && (
                                  <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                                    Preview
                                  </span>
                                )}
                              {isEnrolled && content.completed && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {chapter.lessons?.length === 0 &&
                    chapter.mcqs?.length === 0 && (
                      <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                        <Clock3 className="h-4 w-4" />
                        Content will be available soon
                      </div>
                    )}

                  {/* Start Chapter Button for Enrolled Users */}
                  {isEnrolled &&
                    (chapter.lessons?.length > 0 ||
                      chapter.mcqs?.length > 0) && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() =>
                            router.push(
                              `/user/courses/learn/${courseId}?chapter=${chapter.id}`,
                            )
                          }
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {chapter.user_progress?.completed
                            ? "Review Chapter"
                            : "Start Chapter"}
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {chapters.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p>No chapters available yet.</p>
        </div>
      )}
    </div>
  );
}
