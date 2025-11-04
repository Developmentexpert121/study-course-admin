"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useApiClient } from "@/lib/api";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useCourseProgress } from "@/hooks/useCourseProgress";

// Import types

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

  // Updated state management
  const [selectedLesson, setSelectedLesson] = useState<{
    chapter: any;
    lesson: any;
  } | null>(null);

  // Use the hook for all progress-related state
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

  // Load course data and progress
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

      // 1. Load course details
      const courseResponse = await api.get(
        `course/${courseId}/full-details?user_id=${userId}`,
      );

      if (!courseResponse.success || !courseResponse.data?.data?.course) {
        throw new Error(courseResponse?.error?.message || "Course not found");
      }

      const courseData: any = courseResponse.data.data.course;

      // 2. Load user progress
      const progressResponse = await api.get(
        `progress/${courseId}/progress?user_id=${userId}`,
      );

      if (progressResponse.success) {
        setCourseProgress(progressResponse.data.data);
      }

      setCourse(courseData);

      // Auto-select first lesson if available and not locked
      if (courseData.chapters?.[0]?.lessons?.[0]) {
        const firstChapter = courseData.chapters[0];
        const firstLesson = firstChapter.lessons[0];

        // Check if chapter is not locked
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

    // Set the selected lesson first
    setSelectedLesson({ chapter, lesson });

    // Only mark as completed if it's not already completed
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

  // Navigation functions for VideoSection
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
      // Next lesson in same chapter
      const nextLesson = currentChapter.lessons[nextLessonIndex];
      setSelectedLesson({ chapter: currentChapter, lesson: nextLesson });
    } else {
      // First lesson in next chapter
      const nextChapterIndex = chapterIndex + 1;
      if (nextChapterIndex < course.chapters.length) {
        const nextChapter = course.chapters[nextChapterIndex];

        // Check if next chapter is not locked
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
      // Previous lesson in same chapter
      const currentChapter = course?.chapters[chapterIndex];
      const prevLesson = currentChapter.lessons[prevLessonIndex];
      setSelectedLesson({ chapter: currentChapter, lesson: prevLesson });
    } else {
      // Last lesson in previous chapter
      const prevChapterIndex = chapterIndex - 1;
      if (prevChapterIndex >= 0) {
        const prevChapter = course.chapters[prevChapterIndex];

        // Check if previous chapter is not locked
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

    // Check if there's a next chapter that's not locked and has lessons
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

    // Check if there's a previous chapter that's not locked and has lessons
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            Loading your course...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <div className="text-2xl">⚠️</div>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {error || "Course not found"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please check the course URL and try again.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <CourseHeader
        title={course.title}
        progress={courseProgress?.overall_progress}
        courseId={courseId}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-4">
            {/* Video Player - Takes 3/4 on xl screens */}
            <div className="xl:col-span-3">
              {selectedLesson ? (
                <VideoSection
                  chapter={selectedLesson.chapter}
                  lesson={selectedLesson.lesson}
                  onNextLesson={handleNextLesson}
                  onPreviousLesson={handlePreviousLesson}
                  hasNextLesson={hasNextLesson()}
                  hasPreviousLesson={hasPreviousLesson()}
                />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
                  <div className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Select a lesson to start learning
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Choose a lesson from the sidebar to begin your course
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content Sidebar - Takes 1/4 on xl screens */}
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
          <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-6">
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
