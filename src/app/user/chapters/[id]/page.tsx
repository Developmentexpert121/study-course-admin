"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  VideoIcon,
  Calendar,
  User,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Divide,
  Heading1,
} from "lucide-react";

import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function ChapterDetail() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id;
  const api = useApiClient();

  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<any>({
    type: "image",
    items: [],
  });
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Media completion tracking
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set());
  const [viewedVideos, setViewedVideos] = useState<Set<number>>(new Set());
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(
    new Set(),
  );
  const [videoProgress, setVideoProgress] = useState<{
    [key: number]: { watchTime: number; canComplete: boolean };
  }>({});
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [historymcqs, sethistorymcqs] = useState(false);

  const [totalmedia, settotalmedia] = useState<any>(null);
  const [cototalmedia, setcototalmedia] = useState<any>(null);

  // MCQ state
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [submittedMcqs, setSubmittedMcqs] = useState<Set<string>>(new Set());
  const [mcqResults, setMcqResults] = useState<Record<string, boolean>>({});

  // Check if media is completed to unlock MCQs
  const [mediaCompleted, setMediaCompleted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [totalmcqsinhistory, settotalmcqsinhistory] = useState(0);
  const [totalrightmcqsinhistory, settotalrightmcqsinhistory] = useState(0);
  const [totalnomarks, settotalnomarks] = useState(0);
  const [passfail, setpassfail] = useState(false);

  const handleTryAgain = () => {
    // Reset all MCQ-related state
    setSelectedAnswers({});
    setSubmittedMcqs(new Set());
    setMcqResults({});
    setSubmissionData(null);
  };

  const fetchChapterNavigation = async (click: any) => {
    try {
      const res = await api.get(
        `chapter/navigation/chapter-navigation?chapter_id=${chapterId}`,
      );

      if (res.success) {
        const userId = getDecryptedItem("userId");
        const courseId = chapter?.course_id;
        if (click == "next") {
          if (!res.data?.data?.data.has_next) {
            toasterSuccess(
              "This is the last chapter. You have completed all chapters.",
              3000,
            );
            router.push(`/user/courses_result/${userId}?course_id=${courseId}`);
          }
          const nextchapterNavigation = res.data?.data?.data.next_chapter.id;
          router.push(`/user/chapters/${nextchapterNavigation}`);
        } else {
          if (!res.data?.data?.data.has_previous) {
            toasterSuccess("this is first chapter", 3000);
          }
          const prevchapterNavigation =
            res.data?.data?.data.previous_chapter.id;
          router.push(`/user/chapters/${prevchapterNavigation}`);
        }
      } else {
        console.error("Failed to fetch navigation:", res.error?.message);
      }
    } catch (err: any) {
      // toasterSuccess("This is last chapter you completed all Chapters", 3000);
    } finally {
    }
  };

  const fetchChapterDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`chapter/${chapterId}`);

      if (res.success) {
        const chapterData = res.data?.data?.chapter;

        if (chapterData) {
          setChapter(chapterData);

          if (chapterData.course_id) {
            await fetchChapterMcqsWithPrevious(chapterData.id);
          }
        } else {
          setError("Chapter data not found in response");
          toasterError("Chapter data format unexpected", 3000);
        }
      } else {
        setError(res.error?.message || "API returned unsuccessful");
        toasterError(res.error?.message || "Failed to load chapter", 3000);
      }
    } catch (err: any) {
      console.error("Failed to fetch chapter:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to load chapter";
      setError(errorMsg);
      toasterError(errorMsg, 3000);
    } finally {
      setLoading(false);
    }
  };
  const fetchChapterMcqsWithPrevious = async (chapterId: string) => {
    try {
      const userId = getDecryptedItem("userId");
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      const res = await api.get(
        `mcq/getStudentMcqsWithPrevious?user_id=${userId}&chapter_id=${chapterId}`,
      );

      if (res.success) {
        const { mcqs: mcqData, previousAnswers: historepreviousAnswers } =
          res.data?.data;

        // const previousAnswers = res.data.data.previousAnswers
        if (historepreviousAnswers && historepreviousAnswers.length > 0) {
          setMcqs(historepreviousAnswers);
          const totalmacks = historepreviousAnswers.length;
          settotalmcqsinhistory(totalmacks);
          const totalCorrect = historepreviousAnswers.filter(
            (answer: any) => answer.is_correct,
          ).length;
          settotalrightmcqsinhistory(totalCorrect);
          const totalnumberof_user = (totalCorrect / totalmacks) * 100;

          if (totalnumberof_user < 75) {
            setMcqs(mcqData);
          }
          setpassfail(true);
          settotalnomarks(totalnumberof_user);
          sethistorymcqs(true);
          // Store previous submission data
        } else {
          setMcqs(mcqData);
        }
      } else {
        console.log(
          "Failed to fetch MCQs with previous attempts:",
          res.error?.message,
        );
        setMcqs([]);
      }
    } catch (err) {
      console.log("Failed to fetch chapter MCQs with previous attempts:", err);
      setMcqs([]);
    }
  };

  // Function to check if media is completed
  const checkMediaCompletion = () => {
    const totalImages = chapter?.images?.length || 0;
    const totalVideos = chapter?.videos?.length || 0;

    const allImagesViewed =
      totalImages === 0 || viewedImages.size === totalImages;
    const allVideosCompleted =
      totalVideos === 0 || completedVideos.size === totalVideos;
    const isMediaCompleted = allImagesViewed && allVideosCompleted;
    setMediaCompleted(isMediaCompleted);
    // || totalrightmcqsinhistory/totalmcqsinhistory*100 <= 75
    return isMediaCompleted;
  };

  // Function to check if chapter is completed
  const checkChapterCompletion = () => {
    const isMediaCompleted = checkMediaCompletion();
    const totalMcqs = mcqs.length || 0;
    const allMcqsCompleted =
      totalMcqs === 0 || submittedMcqs.size === totalMcqs;

    const isCompleted = isMediaCompleted && allMcqsCompleted;
    setChapterCompleted(isCompleted);

    return isCompleted;
  };

  // Handle MCQ answer selection
  const handleAnswerSelect = (mcqId: string, answer: string) => {
    // Only allow selection if not submitted yet
    if (!submittedMcqs.has(mcqId)) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [mcqId]: answer,
      }));
    }
  };

  // Add this useEffect to automatically check completion when viewedImages changes
  useEffect(() => {
    checkMediaCompletion();
    checkChapterCompletion();
  }, [viewedImages, completedVideos]); // Add all dependencies that affect completion

  // Function to handle image viewing
  const handleImageView = (index: number) => {
    const newViewedImages = new Set(viewedImages);
    newViewedImages.add(index);
    setViewedImages(newViewedImages);

    // Check completion immediately after state update
    checkMediaCompletion();
    checkChapterCompletion();
  };

  // Function to handle video play
  const handleVideoPlay = (index: number) => {
    const newViewedVideos = new Set(viewedVideos);
    newViewedVideos.add(index);
    setViewedVideos(newViewedVideos);
  };

  // Smart video completion logic
  const handleVideoTimeUpdate = (
    index: number,
    currentTime: number,
    duration: number,
  ) => {
    if (!duration || duration === 0) return;

    const watchPercentage = (currentTime / duration) * 100;
    const watchTimeSeconds = currentTime;

    const conditions = {
      watchedMost: watchPercentage >= 60,
      watchedLongEnough: watchTimeSeconds >= 90,
      nearEnd: watchPercentage >= 80,
      fullCompletion: watchPercentage >= 95,
    };

    const canComplete = Object.values(conditions).some(
      (condition) => condition,
    );

    setVideoProgress((prev) => ({
      ...prev,
      [index]: {
        watchTime: currentTime,
        canComplete,
      },
    }));

    if (canComplete && !completedVideos.has(index)) {
      const newCompletedVideos = new Set(completedVideos);
      newCompletedVideos.add(index);
      setCompletedVideos(newCompletedVideos);
      setTimeout(() => {
        checkMediaCompletion();
        checkChapterCompletion();
      }, 100);
    }
  };

  // Manual video completion
  const handleManualVideoComplete = (index: number) => {
    const newCompletedVideos = new Set(completedVideos);
    newCompletedVideos.add(index);
    setCompletedVideos(newCompletedVideos);
    setTimeout(() => {
      checkMediaCompletion();
      checkChapterCompletion();
    }, 100);
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId]);

  // Reset completion tracking when chapter changes
  useEffect(() => {
    if (chapter) {
      setViewedImages(new Set());
      setViewedVideos(new Set());
      setCompletedVideos(new Set());
      setVideoProgress({});
      setChapterCompleted(false);
      setSelectedAnswers({});
      setSubmittedMcqs(new Set());
      setMcqResults({});

      setTimeout(() => {
        checkMediaCompletion();
        checkChapterCompletion();
      }, 100);
    }
  }, [chapter]);

  // Progress indicator component
  const ProgressIndicator = () => {
    const totalImages = chapter?.images?.length || 0;
    const totalVideos = chapter?.videos?.length || 0;
    const totalMedia = totalImages + totalVideos;

    settotalmedia(totalMedia);

    if (totalMedia === 0) {
      return (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">
              Media completed - Proceed to quiz
            </span>
          </div>
        </div>
      );
    }

    const completedCount = viewedImages.size + completedVideos.size;
    setcototalmedia(completedCount);
    const progressPercentage = (completedCount / totalMedia) * 100;

    return (
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Chapter Progress
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-300">
            {completedCount}/{totalMedia} completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800">
          <div
            className="h-2 rounded-full bg-[#02517b]transition-all duration-300 dark:bg-blue-400"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-300">
          Images: {viewedImages.size}/{totalImages} • Videos:{" "}
          {completedVideos.size}/{totalVideos}
        </div>
        {mediaCompleted && !chapterCompleted && (
          <div className="mt-2 flex items-center text-green-800 dark:text-green-200">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">
              Media completed! Proceed to quiz section.
            </span>
          </div>
        )}
        {chapterCompleted && (
          <div className="mt-2 flex items-center text-green-800 dark:text-green-200">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">
              Chapter completed! Ready to proceed.
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderResultsSection = () => {
    if (!submissionData) {
      return null;
    }

    return (
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          📊 Quiz Results
        </h2>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {submissionData.score || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Score
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {submissionData.total_questions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Questions
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <div
              className={`text-2xl font-bold ${
                parseFloat(submissionData.percentage || "0") >=
                (submissionData.passing_threshold || 70)
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {submissionData.percentage || "0"}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Percentage
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <div
              className={`text-lg font-bold ${
                submissionData.passed
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {submissionData.passed ? "✅ PASSED" : "❌ FAILED"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Required: {submissionData.passing_threshold || 75}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Your Score</span>
            <span>
              {submissionData.percentage || "0"}% /{" "}
              {submissionData.passing_threshold || 70}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                submissionData.passed ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(100, parseFloat(submissionData.percentage || "0"))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Message */}
        {submissionData.message && (
          <div
            className={`rounded-lg p-4 ${
              submissionData.passed
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            }`}
          >
            <p className="font-medium">{submissionData.message}</p>
          </div>
        )}

        {/* Additional Data (if any) */}
        {Object.keys(submissionData).filter(
          (key) =>
            ![
              "score",
              "total_questions",
              "percentage",
              "passed",
              "passing_threshold",
              "message",
              "results",
            ].includes(key),
        ).length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              View Additional Data
            </summary>
            <div className="mt-2 rounded bg-gray-100 p-3 text-xs dark:bg-gray-800">
              <pre>{JSON.stringify(submissionData, null, 2)}</pre>
            </div>
          </details>
        )}

        {submissionData.percentage < 74 ? (
          <div className="flex justify-between">
            <div className="max-w-md font-medium text-red-600">
              Unfortunately, you didn't pass this quiz. You scored{" "}
              {submissionData.percentage}%, but needed 75% to pass. Review the
              material and try again!
            </div>
            <button
              className="rounded-lg bg-blue-700 px-6 py-3 text-white transition-colors hover:bg-blue-900"
              onClick={handleTryAgain}
            >
              Try agian
            </button>
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="font-medium text-green-600">
              Congratulations! You passed with a score of{" "}
              {submissionData.percentage}%. Well done on mastering this
              chapter's content.
            </div>
            <button
              className="rounded-lg bg-blue-700 px-6 py-3 text-white transition-colors hover:bg-blue-900"
              onClick={() => fetchChapterNavigation("next")}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render MCQs component - Only visible when media is completed
  const renderMcqs = () => {
    if (!mcqs.length) return null;

    //  if (!mediaCompleted) {
    //     return (

    //       <div className=" mx-auto ">
    //         {/* Header */}

    //         {/* Media Section */}

    //         {/* Media Modal */}
    //         {showMediaModal && (
    //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
    //             <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
    //               <button
    //                 onClick={() => setShowMediaModal(false)}
    //                 className="absolute top-4 right-4 z-10 text-white bg-red-600 rounded-full p-2 hover:bg-red-700"
    //               >
    //                 ✕
    //               </button>

    //               {activeMedia.type === "image" ? (
    //                 <img
    //                   src={activeMedia.items[0]}
    //                   alt="Chapter media"
    //                   className="w-full h-auto max-h-[85vh] object-contain"
    //                   onError={(e) => {
    //                     (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
    //                   }}
    //                 />
    //               ) : (
    //                 <video
    //                   controls
    //                   autoPlay
    //                   className="w-full h-auto max-h-[85vh]"
    //                 >
    //                   <source src={activeMedia.items[0]} type="video/mp4" />
    //                 </video>
    //               )}
    //             </div>
    //           </div>
    //         )}

    //         <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
    //           <div className="flex flex-col items-center justify-center text-center py-8">
    //             <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mb-4">
    //               <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
    //             </div>
    //             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    //               Quiz Locked
    //             </h3>
    //             <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
    //               Complete all videos and images in this chapter to unlock the quiz questions.
    //             </p>
    //             <div className="flex items-center text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
    //               <span className="mr-2">Progress:</span>
    //               <span>
    //                 {viewedImages.size}/{chapter?.images?.length || 0} images viewed •
    //                 {" "}{completedVideos.size}/{chapter?.videos?.length || 0} videos completed
    //               </span>
    //             </div>
    //           </div>
    //         </div>

    //       </div>

    //     );
    //   }

    if (totalnomarks < 75) {
      if (!mediaCompleted) {
        return (
          <div className="mx-auto">
            {/* Header */}

            {/* Media Section */}

            {/* Media Modal */}
            {showMediaModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
                <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setShowMediaModal(false)}
                    className="absolute right-4 top-4 z-10 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                  >
                    ✕
                  </button>

                  {activeMedia.type === "image" ? (
                    <img
                      src={activeMedia.items[0]}
                      alt="Chapter media"
                      className="h-auto max-h-[85vh] w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.jpg";
                      }}
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      className="h-auto max-h-[85vh] w-full"
                    >
                      <source src={activeMedia.items[0]} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/30">
                  <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Quiz Locked
                </h3>
                <p className="mb-4 max-w-md text-gray-600 dark:text-gray-400">
                  Complete all videos and images in this chapter to unlock the
                  quiz questions.
                </p>
                <div className="flex items-center rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                  <span className="mr-2">Progress:</span>
                  <span>
                    {viewedImages.size}/{chapter?.images?.length || 0} images
                    viewed • {completedVideos.size}/
                    {chapter?.videos?.length || 0} videos completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Check if all questions are answered
      const allAnswered = mcqs.every(
        (mcq) => selectedAnswers[mcq._id || mcq.id],
      );
      const someSubmitted = submittedMcqs.size > 0;
      const allSubmitted = submittedMcqs.size === mcqs.length;
      return (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quiz Questions ({mcqs.length})
            </h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Unlocked ✓
            </span>
          </div>

          <div className="space-y-6">
            {mcqs.map((mcq, index) => {
              const isSubmitted = submittedMcqs.has(mcq._id || mcq.id);
              const isCorrect = mcqResults[mcq._id || mcq.id];

              return (
                <div
                  key={mcq._id || mcq.id}
                  className={`rounded-lg border p-4 ${
                    isSubmitted
                      ? isCorrect
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-gray-800"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    {index + 1}. {mcq.question}
                  </h4>

                  <div className="space-y-2">
                    {mcq.options &&
                      mcq.options.map((option: string, optIndex: number) => {
                        const optionLetter = String.fromCharCode(65 + optIndex);
                        const isSelected =
                          selectedAnswers[mcq._id || mcq.id] === option;
                        // Find the result for this specific MCQ from submissionData
                        const result = submissionData?.results?.find(
                          (r: any) =>
                            r.mcq_id.toString() ===
                            (mcq.id || mcq._id).toString(),
                        );

                        // const isCorrectAnswer = option == result;

                        // Check if this option is the correct answer based on submission data
                        const isCorrectAnswer = result
                          ? option === result.correct_option
                          : false;

                        // Check if this option was selected by the user
                        const isUserSelected = result
                          ? option === result.selected_option
                          : false;

                        return (
                          <label
                            key={optIndex}
                            className={`flex cursor-pointer items-center rounded-md p-3 transition-colors ${
                              !isSubmitted
                                ? isSelected
                                  ? "border border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30"
                                  : "border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                : isUserSelected && isCorrectAnswer
                                  ? "border border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30"
                                  : isUserSelected && !isCorrectAnswer
                                    ? "border border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/30"
                                    : "border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`mcq-${mcq._id || mcq.id}`}
                              value={option}
                              checked={isSelected}
                              onChange={() =>
                                handleAnswerSelect(mcq._id || mcq.id, option)
                              }
                              disabled={isSubmitted}
                              className="mr-3"
                            />
                            <span className="mr-2 font-medium">
                              {optionLetter}.
                            </span>
                            <span>{option}</span>

                            {/* Only show correct/incorrect for the user's selected option */}
                            {isSubmitted && isUserSelected && (
                              <span
                                className={`ml-auto ${isCorrectAnswer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {isCorrectAnswer ? "✓ Correct" : "✗ Incorrect"}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>

                  {/* Status indicator for each question */}
                  {/* {isSubmitted && (
                <div className={`mt-3 p-2 rounded-md text-center ${
                  isCorrect 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
              )} */}
                </div>
              );
            })}
          </div>

          {/* Single Submit Button for All MCQs */}
          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">
                  Submit All Answers
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {allSubmitted
                    ? "All questions submitted. You can reset to try again."
                    : !allAnswered
                      ? `Answer all ${mcqs.length - Object.keys(selectedAnswers).length} remaining questions to submit`
                      : "Ready to submit all answers"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitAllMcqAnswers}
                  disabled={!allAnswered}
                  className={`rounded-lg px-6 py-3 transition-colors ${
                    allAnswered
                      ? "bg-[#02517b]text-white hover:bg-[#1A6A93]"
                      : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  Submit All Answers
                </button>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm text-blue-700 dark:text-blue-300">
                <span>
                  Progress: {Object.keys(selectedAnswers).length}/{mcqs.length}{" "}
                  answered
                </span>
                <span>
                  {submittedMcqs.size}/{mcqs.length} submitted
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800">
                <div
                  className="h-2 rounded-full bg-[#02517b]transition-all duration-300 dark:bg-blue-400"
                  style={{
                    width: `${(Object.keys(selectedAnswers).length / mcqs.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {renderResultsSection()}
        </div>
      );
    }

    if (historymcqs) {
      return (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quiz Questions ({mcqs.length})
            </h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Unlocked ✓
            </span>
          </div>

          <div className="space-y-6">
            {mcqs.map((mcq, index) => {
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 bg-green-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    {index + 1}. {mcq.question}
                  </h4>
                  <div>
                    <h4>Selected Answer</h4> {mcq.selected_option}
                  </div>

                  <div>
                    {mcq.is_correct ? (
                      <div className="text-green-600 dark:text-green-400">
                        ✓ Correct
                      </div>
                    ) : (
                      <div className="text-red-600 dark:text-red-400">
                        ✗ Incorrect
                      </div>
                    )}
                  </div>

                  {/* result div */}
                </div>
              );
            })}
          </div>

          {/* {result of lastattempts} */}

          <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              📊 Quiz Result
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalrightmcqsinhistory}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Score
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalmcqsinhistory}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Questions
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold">
                  {(totalrightmcqsinhistory / totalmcqsinhistory) * 100}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Percentage
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {/*  {submissionData.passed ? '✅ PASSED' : '❌ FAILED'} */}
                  {passfail ? "✅ PASSED" : "❌ FAILED"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Required: 75%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Your Score</span>
                <span>
                  {(totalrightmcqsinhistory / totalmcqsinhistory) * 100}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-red-200 transition-all duration-500"
                  style={{
                    width: `${(totalrightmcqsinhistory / totalmcqsinhistory) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Message */}

            {/* Additional Data (if any) */}
          </div>

          <div className="mt-5 flex justify-between">
            <button
              onClick={() => fetchChapterNavigation("previous")}
              className="rounded-lg bg-blue-700 bg-gray-300 px-6 py-3 text-white transition-colors hover:bg-blue-900"
            >
              Previous
            </button>

            <button
              onClick={() => fetchChapterNavigation("next")}
              className="rounded-lg bg-blue-700 px-6 py-3 text-white transition-colors hover:bg-blue-900"
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quiz Questions ({mcqs.length})
          </h3>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Unlocked ✓
          </span>
        </div>

        <div className="space-y-6">
          {mcqs.map((mcq: any, index: number) => {
            const isSubmitted = submittedMcqs.has(mcq._id || mcq.id);
            const isCorrect = mcqResults[mcq._id || mcq.id];

            return (
              <div
                key={mcq._id || mcq.id}
                className={`rounded-lg border p-4 ${
                  isSubmitted
                    ? isCorrect
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-gray-800"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                  {index + 1}. {mcq.question}
                </h4>

                <div className="space-y-2">
                  {mcq.options &&
                    mcq.options.map((option: string, optIndex: number) => {
                      const optionLetter = String.fromCharCode(65 + optIndex);
                      const isSelected =
                        selectedAnswers[mcq._id || mcq.id] === option;
                      // Find the result for this specific MCQ from submissionData
                      const result = submissionData?.results?.find(
                        (r: any) =>
                          r.mcq_id.toString() ===
                          (mcq.id || mcq._id).toString(),
                      );

                      // const isCorrectAnswer = option == result;

                      // Check if this option is the correct answer based on submission data
                      const isCorrectAnswer = result
                        ? option === result.correct_option
                        : false;

                      // Check if this option was selected by the user
                      const isUserSelected = result
                        ? option === result.selected_option
                        : false;

                      return (
                        <label
                          key={optIndex}
                          className={`flex cursor-pointer items-center rounded-md p-3 transition-colors ${
                            !isSubmitted
                              ? isSelected
                                ? "border border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30"
                                : "border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                              : isUserSelected && isCorrectAnswer
                                ? "border border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30"
                                : isUserSelected && !isCorrectAnswer
                                  ? "border border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/30"
                                  : "border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`mcq-${mcq._id || mcq.id}`}
                            value={option}
                            checked={isSelected}
                            onChange={() =>
                              handleAnswerSelect(mcq._id || mcq.id, option)
                            }
                            disabled={isSubmitted}
                            className="mr-3"
                          />
                          <span className="mr-2 font-medium">
                            {optionLetter}.
                          </span>
                          <span>{option}</span>

                          {/* Only show correct/incorrect for the user's selected option */}
                          {isSubmitted && isUserSelected && (
                            <span
                              className={`ml-auto ${isCorrectAnswer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                            >
                              {isCorrectAnswer ? "✓ Correct" : "✗ Incorrect"}
                            </span>
                          )}
                        </label>
                      );
                    })}
                </div>

                {/* Status indicator for each question */}
                {/* {isSubmitted && (
                <div className={`mt-3 p-2 rounded-md text-center ${
                  isCorrect 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
              )} */}
              </div>
            );
          })}
        </div>

        {/* Single Submit Button for All MCQs */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex-1">
              <h4 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">
                Submit All Answers
              </h4>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitAllMcqAnswers}
                className="'bg-gray-300 cursor-not-allowed rounded-lg px-6 py-3 text-gray-500 transition-colors dark:bg-gray-600 dark:text-gray-400"
              >
                Submit All Answers
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm text-blue-700 dark:text-blue-300">
              <span>
                Progress: {Object.keys(selectedAnswers).length}/{mcqs.length}{" "}
                answered
              </span>
              <span>
                {submittedMcqs.size}/{mcqs.length} submitted
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800">
              <div
                className="h-2 rounded-full bg-[#02517b]transition-all duration-300 dark:bg-blue-400"
                style={{
                  width: `${(Object.keys(selectedAnswers).length / mcqs.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {renderResultsSection()}
      </div>
    );
  };

  const submitAllMcqAnswers = async () => {
    try {
      // Get user ID from cookies
      const userId: any = getDecryptedItem("userId");

      if (!userId) {
        toasterError("User not authenticated. Please login again.", 3000);
        return;
      }

      const answers = mcqs.map((mcq) => ({
        mcq_id: mcq.id || mcq._id,
        selected_option: selectedAnswers[mcq._id || mcq.id],
      }));

      const res: any = await api.post("mcq/submit-all", {
        user_id: parseInt(userId),
        chapter_id: parseInt(chapterId as string),
        answers,
      });

      if (res.success) {
        const dataallresl = res.data?.data?.data;

        setSubmissionData(res?.data?.data?.data);

        const allMcqIds = mcqs.map((mcq) => mcq._id || mcq.id);
        setSubmittedMcqs(new Set(allMcqIds));

        const results = res.data.data.results || [];
        const newResults = {};
        setMcqResults(newResults);
        setSubmissionData(dataallresl);

        if (dataallresl.passed) {
          toasterSuccess(
            `Congratulation! You passed with ${dataallresl.score}/${dataallresl.total_questions} correct answers (${dataallresl.score})`,
            5000,
          );
        } else {
          toasterError(
            `You scored ${dataallresl.score}/${dataallresl.total_questions} (${dataallresl.percentage}%) try again.`,
            5000,
          );
        }
      } else {
        toasterError(res.error?.message || "Failed to submit answers", 3000);
      }
    } catch (err: any) {
      console.error("Failed to submit all MCQ answers:", err);
      toasterError(
        err.response?.data?.message || "Failed to submit answers",
        3000,
      );
    }
  };

  // Updated image rendering with tracking
  const renderImages = () => {
    if (!chapter.images?.length) return null;

    return (
      <div className="mb-8">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <ImageIcon className="mr-2 h-5 w-5" />
          Images ({chapter.images.length}) - {viewedImages.size} viewed
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chapter.images.map((url: string, index: number) => (
            <div key={index} className="relative">
              <div
                className={`relative transform cursor-pointer transition-transform hover:scale-105 ${
                  viewedImages.has(index) ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => {
                  handleImageView(index);
                  setActiveMedia({ type: "image", items: [url] });
                  setShowMediaModal(true);
                }}
              >
                <img
                  src={url}
                  alt={`Chapter image ${index + 1}`}
                  className="h-48 w-full rounded-lg border border-gray-200 object-cover dark:border-gray-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.jpg";
                  }}
                />
                {viewedImages.has(index) && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1 text-white">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Updated video rendering with smart completion
  const renderVideos = () => {
    if (!chapter.videos?.length) return null;

    return (
      <div>
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <VideoIcon className="mr-2 h-5 w-5" />
          Videos ({chapter.videos.length}) - {completedVideos.size} completed
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {chapter.videos.map((url: string, index: number) => {
            const progress = videoProgress[index];
            const isCompleted = completedVideos.has(index);
            const canComplete = progress?.canComplete || false;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg bg-black ${
                  isCompleted ? "ring-2 ring-green-500" : ""
                }`}
              >
                <video
                  controls
                  className="h-auto max-h-96 w-full"
                  poster={chapter.images?.[0] || undefined}
                  onPlay={() => handleVideoPlay(index)}
                  onTimeUpdate={(e) =>
                    handleVideoTimeUpdate(
                      index,
                      (e.target as HTMLVideoElement).currentTime,
                      (e.target as HTMLVideoElement).duration,
                    )
                  }
                  onEnded={() => {
                    handleManualVideoComplete(index);
                  }}
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Completion indicator */}
                {isCompleted && (
                  <div className="absolute right-2 top-2 z-10 rounded-full bg-green-500 p-1 text-white">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Smart completion button */}
                {canComplete && !isCompleted && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      onClick={() => handleManualVideoComplete(index)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white shadow-lg transition-colors hover:bg-green-700"
                    >
                      ✓ Mark Complete
                    </button>
                  </div>
                )}

                {/* Status indicator */}
                <div className="absolute bottom-2 left-2 z-10 rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                  {isCompleted
                    ? "Completed"
                    : canComplete
                      ? "Ready to Complete"
                      : viewedVideos.has(index)
                        ? "In Progress"
                        : "Not Started"}
                </div>

                {/* Progress bar for incomplete videos */}
                {!isCompleted && progress && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-gray-200">
                    <div
                      className="h-1 bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (progress.watchTime / (progress.watchTime > 0 ? Math.max(progress.watchTime * 2, 300) : 300)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Helpful message */}
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
          <p>
            💡 <strong>Tip:</strong> Videos are automatically marked complete
            when you watch 60% of the content, watch for 90+ seconds, or reach
            near the end. You can also use the "Mark Complete" button when it
            appears.
          </p>
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="mr-3 h-8 w-8 animate-spin text-blue-600" />
        <div className="text-lg">Loading chapter details...</div>
      </div>
    );
  }

  // Render error state
  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
        <div className="mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center text-blue-600 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Chapters
          </button>

          <div className="rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <div className="mb-4 text-6xl text-red-500">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Unable to load chapter
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {error || "Chapter not found or inaccessible"}
            </p>
            <button
              onClick={fetchChapterDetail}
              className="rounded-lg bg-[#02517b]px-6 py-2 text-white hover:bg-[#1A6A93]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() =>
              router.push(`/user/courses/${chapter.course_id}/chapter`)
            }
            className="mb-8 flex items-center text-blue-600 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Chapters
          </button>

          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {chapter.title || "Untitled Chapter"}
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Order: {chapter.order || "N/A"}
              </span>
            </div>

            {/* Course Info */}
            {chapter.course_id && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Course Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <BookOpen className="mr-2 inline h-4 w-4" />
                  Course ID: {chapter.course_id}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {chapter.createdAt && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created: {formatDate(chapter.createdAt)}
                </div>
              )}
              {chapter.updatedAt && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Updated: {formatDate(chapter.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {totalnomarks <= 75 ? <ProgressIndicator /> : <></>}

        <div className="mx-auto">
          {/* Header */}

          {/* Media Section */}
          {chapter.images?.length > 0 || chapter.videos?.length > 0 ? (
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Media Files
              </h2>

              {/* Images with tracking */}
              {renderImages()}

              {/* Videos with smart completion */}
              {renderVideos()}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-gray-800">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No media files available for this chapter
              </p>
            </div>
          )}

          {/* Media Modal */}
          {showMediaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
              <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                >
                  ✕
                </button>

                {activeMedia.type === "image" ? (
                  <img
                    src={activeMedia.items[0]}
                    alt="Chapter media"
                    className="h-auto max-h-[85vh] w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    className="h-auto max-h-[85vh] w-full"
                  >
                    <source src={activeMedia.items[0]} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chapter Content
            </h2>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div
              className="leading-relaxed text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{
                __html:
                  chapter.content ||
                  "<p>No content available for this chapter.</p>",
              }}
            />
          </div>
        </div>

        {renderMcqs()}

        {mcqs.length <= 0 &&
          (cototalmedia == totalmedia || totalmedia == 0) && (
            <div className="flex justify-end">
              {" "}
              <button
                className="rounded-lg bg-blue-700 px-6 py-3 text-white transition-colors hover:bg-blue-900"
                onClick={() => fetchChapterNavigation("next")}
              >
                Next
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
