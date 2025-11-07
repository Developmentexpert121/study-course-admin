"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useApiClient } from "@/lib/api";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useCourseProgress } from "@/hooks/useCourseProgress";

import CourseHeader from "../../../../components/user/course-learn/CourseHeader";
import CourseTabs from "@/components/user/course-learn/CourseTabs";
import CourseContentSidebar from "@/components/user/course-learn/CourseContentSidebar";
import MCQModal from "@/components/user/course-learn/MCQModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import VideoSection from "@/components/user/course-learn/VideoPlayer";

export default function CourseLearnPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const api = useApiClient();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedLesson, setSelectedLesson] = useState<{
    chapter: any;
    lesson: any;
  } | null>(null);

  const {
    courseProgress,
    setCourseProgress,
    userAnswers,
    setUserAnswers,
    submittingMCQ,
    currentMCQChapter,
    handleLessonComplete,
    submitMCQTest,
    handleStartMCQ,
    handleCloseMCQ,
    initializeProgress,
    getUserId,
  } = useCourseProgress(courseId, setCourse);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const courseResponse = await api.get(
        `course/${courseId}/full-details?user_id=${userId}`,
      );

      if (!courseResponse.success || !courseResponse.data?.data?.course) {
        throw new Error(courseResponse?.error?.message || "Course not found");
      }

      const courseData: any = courseResponse.data.data.course;

      const progressResponse = await api.get(
        `progress/${courseId}/progress?user_id=${userId}`,
      );

      if (progressResponse.success) {
        setCourseProgress(progressResponse.data.data);
      }

      setCourse(courseData);

      if (courseData.chapters?.[0]?.lessons?.[0]) {
        const firstChapter = courseData.chapters[0];
        const firstLesson = firstChapter.lessons[0];

        if (!firstChapter.locked) {
          setSelectedLesson({ chapter: firstChapter, lesson: firstLesson });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course");
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = async (chapter: any, lesson: any) => {
    if (chapter.locked) {
      alert("This chapter is locked. Complete previous chapters first.");
      return;
    }

    console.log("🎯 [FRONTEND] Lesson clicked:", {
      lessonId: lesson.id,
      chapterId: chapter.id,
      lessonCompleted: lesson.completed,
      chapterTitle: chapter.title,
      lessonTitle: lesson.title,
    });

    setSelectedLesson({ chapter, lesson });

    if (!lesson.completed) {
      console.log("🔄 [FRONTEND] Marking lesson as completed...");
      const success = await handleLessonComplete(lesson.id, chapter.id);

      if (success) {
        console.log("✅ [FRONTEND] Lesson completion process finished");
      } else {
        console.error("❌ [FRONTEND] Failed to mark lesson as completed");
        alert("Failed to mark lesson as completed. Please try again.");
      }
    } else {
      console.log("ℹ️ [FRONTEND] Lesson already completed");
    }
  };

  const getCurrentLessonIndices = () => {
    if (!selectedLesson || !course)
      return { chapterIndex: -1, lessonIndex: -1 };

    const chapterIndex: any = course?.chapters.findIndex(
      (c: any) => c.id === selectedLesson.chapter.id,
    );

    if (chapterIndex === -1) return { chapterIndex: -1, lessonIndex: -1 };

    const lessonIndex = course.chapters[chapterIndex].lessons.findIndex(
      (l: any) => l.id === selectedLesson.lesson.id,
    );

    return { chapterIndex, lessonIndex };
  };

  const handleNextLesson = () => {
    if (!course) return;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return;

    const currentChapter = course?.chapters[chapterIndex];
    const nextLessonIndex = lessonIndex + 1;

    if (nextLessonIndex < currentChapter.lessons.length) {
      const nextLesson = currentChapter.lessons[nextLessonIndex];
      setSelectedLesson({ chapter: currentChapter, lesson: nextLesson });
    } else {
      const nextChapterIndex = chapterIndex + 1;
      if (nextChapterIndex < course.chapters.length) {
        const nextChapter = course.chapters[nextChapterIndex];
        if (!nextChapter.locked && nextChapter.lessons.length > 0) {
          const firstLesson = nextChapter.lessons[0];
          setSelectedLesson({ chapter: nextChapter, lesson: firstLesson });
        }
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!course) return;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return;

    const prevLessonIndex = lessonIndex - 1;

    if (prevLessonIndex >= 0) {
      const currentChapter = course?.chapters[chapterIndex];
      const prevLesson = currentChapter.lessons[prevLessonIndex];
      setSelectedLesson({ chapter: currentChapter, lesson: prevLesson });
    } else {
      const prevChapterIndex = chapterIndex - 1;
      if (prevChapterIndex >= 0) {
        const prevChapter = course.chapters[prevChapterIndex];
        if (!prevChapter.locked && prevChapter.lessons.length > 0) {
          const lastLesson =
            prevChapter.lessons[prevChapter.lessons.length - 1];
          setSelectedLesson({ chapter: prevChapter, lesson: lastLesson });
        }
      }
    }
  };

  const hasNextLesson = () => {
    if (!course || !selectedLesson) return false;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return false;

    const currentChapter = course?.chapters[chapterIndex];
    const hasNextInChapter = lessonIndex < currentChapter.lessons.length - 1;

    if (hasNextInChapter) return true;

    const nextChapterIndex = chapterIndex + 1;
    if (nextChapterIndex < course?.chapters.length) {
      const nextChapter = course?.chapters[nextChapterIndex];
      return !nextChapter.locked && nextChapter.lessons.length > 0;
    }

    return false;
  };

  const hasPreviousLesson = () => {
    if (!course || !selectedLesson) return false;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return false;

    const hasPrevInChapter = lessonIndex > 0;
    if (hasPrevInChapter) return true;

    const prevChapterIndex = chapterIndex - 1;
    if (prevChapterIndex >= 0) {
      const prevChapter = course?.chapters[prevChapterIndex];
      return !prevChapter.locked && prevChapter.lessons.length > 0;
    }

    return false;
  };

  const enhancedHandleStartMCQ = (chapter: any) => {
    handleStartMCQ(chapter);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <LoadingSpinner size="lg" />
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-200 opacity-75"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
            Loading your course experience...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
            <div className="text-3xl">⚠️</div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            {error || "Course not found"}
          </h2>
          <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
            We couldn't load the course. Please check the URL and try again.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100">
      <CourseHeader
        title={course.title}
        progress={courseProgress?.overall_progress}
        courseId={courseId}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-4">
            {/* Video Player Section */}
            <div className="xl:col-span-3">
              {selectedLesson ? (
                <div className="p-6">
                  <VideoSection
                    chapter={selectedLesson.chapter}
                    lesson={selectedLesson.lesson}
                    onNextLesson={handleNextLesson}
                    onPreviousLesson={handlePreviousLesson}
                    hasNextLesson={hasNextLesson()}
                    hasPreviousLesson={hasPreviousLesson()}
                  />
                </div>
              ) : (
                <div className="m-6 flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
                  <div className="text-center">
                    <div className="mx-auto mb-4 rounded-2xl bg-blue-100 p-4 dark:bg-blue-900/30">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Ready to Learn?
                    </h3>
                    <p className="mt-2 max-w-sm text-slate-600 dark:text-slate-400">
                      Select a lesson from the sidebar to begin your learning
                      journey
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content Sidebar */}
            <div className="xl:col-span-1">
              <CourseContentSidebar
                course={course}
                courseProgress={courseProgress}
                onLessonClick={handleLessonClick}
                onStartMCQ={enhancedHandleStartMCQ}
                selectedLesson={selectedLesson}
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
            <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-8">
              <CourseTabs.Content
                activeTab={activeTab}
                course={course}
                courseProgress={courseProgress}
                selectedLesson={selectedLesson}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MCQ Modal */}
      <MCQModal
        show={!!currentMCQChapter}
        chapter={currentMCQChapter}
        userAnswers={userAnswers}
        submittingMCQ={submittingMCQ}
        onAnswerSelect={(mcqId, optionIndex) =>
          setUserAnswers((prev) => ({ ...prev, [mcqId]: optionIndex }))
        }
        onSubmit={submitMCQTest}
        onClose={handleCloseMCQ}
      />
    </div>
  );
}
