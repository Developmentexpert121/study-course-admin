"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

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
    loadProgressData,
  } = useCourseProgress(courseId, setCourse);

  const [forceUpdate, setForceUpdate] = useState(0);

  const handleRateClick = () => {
    setActiveTab("reviews");

    setTimeout(() => {
      if (reviewsSectionRef.current) {
        reviewsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        console.log("❌ [FRONTEND] Reviews section ref not found");

        const reviewsElement = document.getElementById("reviews-section");
        if (reviewsElement) {
          reviewsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }, 100);
  };
  useEffect(() => {
    if (courseId) {
      loadCourseData();
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }
  }, [courseId]);

  const findFirstUnlockedLesson = (courseData: any) => {
    if (!courseData?.chapters) return null;

    for (const chapter of courseData.chapters) {
      if (!chapter.locked && chapter.lessons) {
        for (const lesson of chapter.lessons) {
          if (!lesson.locked) {
            return { chapter, lesson };
          }
        }
      }
    }
    return null;
  };

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log("🔄 [FRONTEND] Loading course data...", { courseId, userId });

      const courseResponse = await api.get(
        `course/${courseId}/full-details?user_id=${userId}`,
      );

      if (!courseResponse.success || !courseResponse.data?.data?.course) {
        throw new Error(courseResponse?.error?.message || "Course not found");
      }

      const courseData: any = courseResponse.data.data.course;

      // Load progress data
      const progressResponse = await api.get(
        `progress/${courseId}/progress?user_id=${userId}`,
      );

      let updatedCourse;

      if (progressResponse.success) {
        console.log(
          "📊 [FRONTEND] Progress data loaded:",
          progressResponse.data.data,
        );
        setCourseProgress(progressResponse.data.data);

        updatedCourse = applyProgressToCourse(
          courseData,
          progressResponse.data.data,
        );
      } else {
        console.log("📊 [FRONTEND] No progress data found, initializing...");
        await initializeProgress({
          course_id: courseId,
          user_id: userId,
          overall_progress: 0,
          chapters: courseData.chapters.map((chapter: any) => ({
            id: chapter.id,
            completed: false,
            mcq_passed: false,
            completed_lessons: 0,
          })),
        });

        updatedCourse = applyProgressToCourse(courseData, { chapters: [] });
      }

      setCourse(updatedCourse);

      const firstUnlockedLesson = findFirstUnlockedLesson(updatedCourse);
      if (firstUnlockedLesson) {
        setSelectedLesson(firstUnlockedLesson);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course");
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyProgressToCourse = (courseData: any, progressData: any) => {
    if (!courseData?.chapters) return courseData;

    console.log(
      "🔓 [FRONTEND] Applying progress to unlock chapters and lessons...",
    );

    const updatedCourse = JSON.parse(JSON.stringify(courseData));

    // Reset all locking first
    updatedCourse.chapters.forEach((chapter: any) => {
      chapter.locked = true;
      if (chapter.lessons) {
        chapter.lessons.forEach((lesson: any) => {
          lesson.locked = true;
          lesson.completed = false;
        });
      }
    });

    // First chapter is always unlocked
    if (updatedCourse.chapters.length > 0) {
      updatedCourse.chapters[0].locked = false;
      if (updatedCourse.chapters[0].lessons?.[0]) {
        updatedCourse.chapters[0].lessons[0].locked = false;
      }
    }

    // Apply progress data if available
    if (progressData?.chapters) {
      progressData.chapters.forEach((chapterProgress: any) => {
        const chapter = updatedCourse.chapters.find(
          (ch: any) => ch.id === chapterProgress.id,
        );
        if (chapter) {
          chapter.locked = false;

          if (chapter.lessons && chapterProgress.completed_lessons) {
            chapter.lessons.forEach((lesson: any, index: number) => {
              if (index < chapterProgress.completed_lessons) {
                lesson.completed = true;
                lesson.locked = false;

                if (index + 1 < chapter.lessons.length) {
                  chapter.lessons[index + 1].locked = false;
                }
              }
            });
          }

          if (chapterProgress.completed || chapterProgress.mcq_passed) {
            const currentIndex = updatedCourse.chapters.findIndex(
              (ch: any) => ch.id === chapter.id,
            );
            if (
              currentIndex !== -1 &&
              currentIndex + 1 < updatedCourse.chapters.length
            ) {
              const nextChapter = updatedCourse.chapters[currentIndex + 1];
              nextChapter.locked = false;
              if (nextChapter.lessons?.[0]) {
                nextChapter.lessons[0].locked = false;
              }
            }
          }
        }
      });
    }

    return updatedCourse;
  };

  const handleLessonClick = async (chapter: any, lesson: any) => {
    if (chapter.locked || lesson.locked) {
      alert("This lesson is locked. Complete previous lessons first.");
      return;
    }

    console.log("🎯 [FRONTEND] Lesson clicked:", {
      lessonId: lesson.id,
      chapterId: chapter.id,
      lessonCompleted: lesson.completed,
      lessonLocked: lesson.locked,
      chapterTitle: chapter.title,
      lessonTitle: lesson.title,
    });

    setSelectedLesson({ chapter, lesson });
  };

  const handleCompleteCurrentLesson = async () => {
    if (!selectedLesson) return;

    const { chapter, lesson } = selectedLesson;

    if (lesson.completed) {
      console.log("ℹ️ [FRONTEND] Lesson already completed");
      return;
    }

    console.log("🔄 [FRONTEND] Manually marking lesson as completed...");
    const success = await handleLessonComplete(lesson.id, chapter.id);

    if (success) {
      console.log("✅ [FRONTEND] Lesson completion process finished");

      await loadProgressData();

      setCourse((prev: any) => {
        if (!prev) return prev;

        const updatedCourse = JSON.parse(JSON.stringify(prev));

        updatedCourse.chapters.forEach((ch: any) => {
          if (ch.id === chapter.id) {
            ch.lessons.forEach((l: any, index: number) => {
              if (l.id === lesson.id) {
                l.completed = true;

                if (index + 1 < ch.lessons.length) {
                  ch.lessons[index + 1].locked = false;
                  console.log(
                    `🔓 [FRONTEND] Unlocked next lesson: ${ch.lessons[index + 1].title}`,
                  );
                }
              }
            });
          }
        });

        return updatedCourse;
      });

      setForceUpdate((prev) => prev + 1);

      setTimeout(() => {
        handleNextLesson(true);
      }, 500);
    } else {
      console.error("❌ [FRONTEND] Failed to mark lesson as completed");
      alert("Failed to mark lesson as completed. Please try again.");
    }
  };

  // FIXED: Simplified MCQ submission handler with automatic modal close
  const enhancedSubmitMCQTest = async () => {
    console.log("🔄 [FRONTEND] Starting enhanced MCQ submission...");

    try {
      const result: any = await submitMCQTest();

      if (result && currentMCQChapter) {
        console.log(
          "✅ [FRONTEND] MCQ submitted successfully:",
          result.passed ? "PASSED" : "FAILED",
        );

        if (result.passed) {
          await loadProgressData();

          setCourse((prev: any) => {
            if (!prev) return prev;

            const updatedCourse = JSON.parse(JSON.stringify(prev));
            const currentChapterIndex = updatedCourse.chapters.findIndex(
              (ch: any) => ch.id === currentMCQChapter.id,
            );

            if (currentChapterIndex !== -1) {
              const currentChapter =
                updatedCourse.chapters[currentChapterIndex];
              currentChapter.mcq_passed = true;
              currentChapter.mcq_results = result;

              if (currentChapterIndex + 1 < updatedCourse.chapters.length) {
                const nextChapter =
                  updatedCourse.chapters[currentChapterIndex + 1];
                nextChapter.locked = false;
                if (nextChapter.lessons?.[0]) {
                  nextChapter.lessons[0].locked = false;
                }
                console.log(
                  `🔓 [FRONTEND] Unlocked next chapter: ${nextChapter.title}`,
                );
              }
            }

            return updatedCourse;
          });
          setCourseProgress(result);
          setForceUpdate((prev) => prev + 1);
          loadCourseData();

          console.log("✅ [FRONTEND] UI updated successfully after MCQ pass");

          // Auto-navigate to next chapter if applicable
          if (
            selectedLesson &&
            selectedLesson.chapter.id === currentMCQChapter.id
          ) {
            const { chapterIndex } = getCurrentLessonIndices();
            if (
              chapterIndex !== -1 &&
              chapterIndex + 1 < course.chapters.length
            ) {
              const nextChapter = course.chapters[chapterIndex + 1];
              if (!nextChapter.locked && nextChapter.lessons.length > 0) {
                setTimeout(() => {
                  console.log(
                    "🔄 [FRONTEND] Auto-navigating to next chapter after MCQ",
                  );
                  setSelectedLesson({
                    chapter: nextChapter,
                    lesson: nextChapter.lessons[0],
                  });
                }, 1000);
              }
            }
          }
        }

        // CRITICAL FIX: Close modal after submission (both pass and fail)
        console.log("🔄 [FRONTEND] Closing MCQ modal after submission");
        enhancedHandleCloseMCQ();
      }
    } catch (error) {
      console.error("❌ [FRONTEND] MCQ submission failed:", error);
      alert("Failed to submit MCQ. Please try again.");

      // Close modal even on error
      enhancedHandleCloseMCQ();
    }
  };

  // FIXED: Enhanced close handler with proper cleanup
  const enhancedHandleCloseMCQ = () => {
    console.log("🔄 [FRONTEND] Closing MCQ modal and cleaning up...");

    // Clear user answers when closing
    setUserAnswers({});

    // Close the modal
    handleCloseMCQ();

    // Force re-render to ensure UI updates
    setTimeout(() => {
      setForceUpdate((prev) => prev + 1);
    }, 100);
  };

  const getCurrentLessonIndices = () => {
    if (!selectedLesson || !course)
      return { chapterIndex: -1, lessonIndex: -1 };

    const chapterIndex = course.chapters.findIndex(
      (c: any) => c.id === selectedLesson.chapter.id,
    );

    if (chapterIndex === -1) return { chapterIndex: -1, lessonIndex: -1 };

    const lessonIndex = course.chapters[chapterIndex].lessons.findIndex(
      (l: any) => l.id === selectedLesson.lesson.id,
    );

    return { chapterIndex, lessonIndex };
  };

  const handleNextLesson = (autoNavigate = false) => {
    if (!course || !selectedLesson) return;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return;

    const currentChapter = course.chapters[chapterIndex];

    const nextLessonIndex = lessonIndex + 1;
    if (nextLessonIndex < currentChapter.lessons.length) {
      const nextLesson = currentChapter.lessons[nextLessonIndex];
      if (!nextLesson.locked) {
        setSelectedLesson({ chapter: currentChapter, lesson: nextLesson });
        return;
      } else if (!autoNavigate) {
        alert("Next lesson is locked. Complete the current lesson first.");
        return;
      }
    }

    const nextChapterIndex = chapterIndex + 1;
    if (nextChapterIndex < course.chapters.length) {
      const nextChapter = course.chapters[nextChapterIndex];

      const isNextChapterUnlocked =
        !nextChapter.locked ||
        (currentChapter.mcq_passed && nextChapterIndex === chapterIndex + 1);

      if (isNextChapterUnlocked && nextChapter.lessons.length > 0) {
        const firstLesson = nextChapter.lessons[0];
        if (!firstLesson.locked) {
          setSelectedLesson({ chapter: nextChapter, lesson: firstLesson });
          return;
        } else if (!autoNavigate) {
          alert("Next chapter is available but first lesson is locked.");
          return;
        }
      } else if (!autoNavigate) {
        if (currentChapter.mcq_passed) {
          alert("Next chapter should be available. Please refresh the page.");
        } else {
          alert("Complete the MCQ test to unlock the next chapter.");
        }
        return;
      }
    }

    if (!autoNavigate) {
      alert("No more lessons available. You've completed this course!");
    }
    console.log("⚠️ [FRONTEND] No unlocked next lesson available");
  };

  const hasNextLesson = () => {
    if (!course || !selectedLesson) return false;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return false;

    const currentChapter = course.chapters[chapterIndex];

    const nextLessonIndex = lessonIndex + 1;
    if (nextLessonIndex < currentChapter.lessons.length) {
      const nextLesson = currentChapter.lessons[nextLessonIndex];
      if (!nextLesson.locked) return true;
    }

    const nextChapterIndex = chapterIndex + 1;
    if (nextChapterIndex < course.chapters.length) {
      const nextChapter = course.chapters[nextChapterIndex];

      const isNextChapterUnlocked =
        !nextChapter.locked ||
        (currentChapter.mcq_passed && nextChapterIndex === chapterIndex + 1);

      if (
        isNextChapterUnlocked &&
        nextChapter.lessons.length > 0 &&
        !nextChapter.lessons[0].locked
      ) {
        return true;
      }
    }

    return false;
  };

  const handlePreviousLesson = () => {
    if (!course || !selectedLesson) return;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return;

    const prevLessonIndex = lessonIndex - 1;
    if (prevLessonIndex >= 0) {
      const prevLesson = course.chapters[chapterIndex].lessons[prevLessonIndex];
      if (!prevLesson.locked) {
        setSelectedLesson({
          chapter: course.chapters[chapterIndex],
          lesson: prevLesson,
        });
        return;
      }
    }

    const prevChapterIndex = chapterIndex - 1;
    if (prevChapterIndex >= 0) {
      const prevChapter = course.chapters[prevChapterIndex];
      if (!prevChapter.locked && prevChapter.lessons.length > 0) {
        for (let i = prevChapter.lessons.length - 1; i >= 0; i--) {
          const lesson = prevChapter.lessons[i];
          if (!lesson.locked) {
            setSelectedLesson({ chapter: prevChapter, lesson });
            return;
          }
        }
      }
    }

    alert("No previous lesson available.");
    console.log("⚠️ [FRONTEND] No unlocked previous lesson available");
  };

  const hasPreviousLesson = () => {
    if (!course || !selectedLesson) return false;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return false;

    const prevLessonIndex = lessonIndex - 1;
    if (prevLessonIndex >= 0) {
      const prevLesson = course.chapters[chapterIndex].lessons[prevLessonIndex];
      if (!prevLesson.locked) return true;
    }

    const prevChapterIndex = chapterIndex - 1;
    if (prevChapterIndex >= 0) {
      const prevChapter = course.chapters[prevChapterIndex];
      if (!prevChapter.locked && prevChapter.lessons.length > 0) {
        return prevChapter.lessons.some((lesson: any) => !lesson.locked);
      }
    }

    return false;
  };

  const isLastLessonInCurrentChapter = () => {
    if (!selectedLesson || !course) return false;

    const { chapterIndex, lessonIndex } = getCurrentLessonIndices();
    if (chapterIndex === -1 || lessonIndex === -1) return false;

    const currentChapter = course.chapters[chapterIndex];
    return lessonIndex === currentChapter.lessons.length - 1;
  };

  const enhancedHandleStartMCQ = (chapter: any) => {
    const allLessonsCompleted = chapter.lessons.every(
      (lesson: any) => lesson.completed,
    );
    if (!allLessonsCompleted) {
      alert(
        "Complete all lessons in this chapter before attempting the MCQ test.",
      );
      return;
    }
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
        onRateClick={handleRateClick}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-4">
            <div className="xl:col-span-3">
              {selectedLesson ? (
                <div className="p-6">
                  <VideoSection
                    key={`${selectedLesson.lesson.id}-${forceUpdate}`}
                    chapter={selectedLesson.chapter}
                    lesson={selectedLesson.lesson}
                    onNextLesson={handleNextLesson}
                    onPreviousLesson={handlePreviousLesson}
                    onCompleteLesson={handleCompleteCurrentLesson}
                    hasNextLesson={hasNextLesson()}
                    hasPreviousLesson={hasPreviousLesson()}
                    isLessonCompleted={selectedLesson.lesson.completed}
                    isLastLessonInChapter={isLastLessonInCurrentChapter()}
                    isMCQPassed={selectedLesson.chapter.mcq_passed}
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

          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
            <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div
              className="p-8"
              ref={activeTab === "reviews" ? reviewsSectionRef : null}
              id="reviews-section"
            >
              <CourseTabs.Content
                activeTab={activeTab}
                course={course}
                courseProgress={courseProgress}
                selectedLesson={selectedLesson}
                key={`tabs-${forceUpdate}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MCQ Modal - Now will close properly after submission */}
      <MCQModal
        show={!!currentMCQChapter}
        chapter={currentMCQChapter}
        userAnswers={userAnswers}
        submittingMCQ={submittingMCQ}
        onAnswerSelect={(mcqId, optionIndex) =>
          setUserAnswers((prev) => ({ ...prev, [mcqId]: optionIndex }))
        }
        onSubmit={enhancedSubmitMCQTest}
        onClose={enhancedHandleCloseMCQ}
      />
    </div>
  );
}
