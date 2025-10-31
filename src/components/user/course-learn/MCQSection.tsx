// components/course-learn/MCQSection.tsx
import React from "react";
import { CheckCircle2, PlayCircle, Lock, RotateCcw } from "lucide-react";

const MCQSection: React.FC<any> = ({
  chapter,
  chapterProgress,
  onStartMCQ,
  mcqResults, // This can now be removed since we store in chapter
}) => {
  const hasMCQs = chapter.mcqs && chapter.mcqs.length > 0;
  const isLocked = chapter.locked;
  const isCompleted = chapter.completed;

  // ✅ Use chapter.mcq_results directly (now properly stored)
  const recentMCQResults = chapter.mcq_results;
  const hasRecentAttempt =
    recentMCQResults && typeof recentMCQResults.passed !== "undefined";

  // Determine MCQ status - priority: recent results > chapter status
  const mcqPassed = hasRecentAttempt
    ? recentMCQResults.passed
    : chapter.mcq_passed;
  const hasFailedMCQ = hasRecentAttempt && !recentMCQResults.passed;

  const canAttemptMCQ = !isLocked && hasMCQs && !mcqPassed;
  const canRetryMCQ = !isLocked && hasMCQs && hasFailedMCQ;
  const allLessonsCompleted = chapterProgress?.all_lessons_completed || false;

  if (!hasMCQs) return null;

  // Use the appropriate results source for display
  const displayResults = hasRecentAttempt ? recentMCQResults : null;

  return (
    <div className="mt-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Chapter Assessment
      </h4>

      <div
        className={`rounded-lg border p-4 ${
          isLocked
            ? "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
            : mcqPassed
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : hasFailedMCQ
                ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
                : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${
                isLocked
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                  : mcqPassed
                    ? "bg-green-500 text-white"
                    : hasFailedMCQ
                      ? "bg-orange-500 text-white"
                      : "bg-blue-500 text-white"
              }`}
            >
              {isLocked ? (
                <Lock className="h-3 w-3" />
              ) : mcqPassed ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : hasFailedMCQ ? (
                <RotateCcw className="h-3 w-3" />
              ) : (
                <PlayCircle className="h-3 w-3" />
              )}
            </div>

            <div className="flex-1">
              <h5 className="font-medium text-gray-900 dark:text-white">
                Chapter MCQ Test
              </h5>

              {/* Dynamic description based on state */}
              {hasFailedMCQ ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {displayResults?.total_questions || chapter.mcqs.length}{" "}
                    questions • Test your knowledge
                  </p>
                  <div className="mt-2 rounded-md bg-orange-100 p-3 dark:bg-orange-900/30">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      ❌{" "}
                      {displayResults?.message ||
                        `MCQ failed. You scored ${displayResults?.score}% but need ${displayResults?.passing_threshold}% to pass.`}
                    </p>
                    <p className="mt-1 text-xs text-orange-700 dark:text-orange-400">
                      {displayResults?.correct_answers || 0} out of{" "}
                      {displayResults?.total_questions || chapter.mcqs.length}{" "}
                      questions correct
                    </p>
                    {displayResults?.attempts_remaining !== undefined && (
                      <p className="mt-1 text-xs text-orange-700 dark:text-orange-400">
                        {displayResults.attempts_remaining} attempt
                        {displayResults.attempts_remaining !== 1
                          ? "s"
                          : ""}{" "}
                        remaining
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-orange-800 dark:text-orange-300">
                      Please retry to unlock next chapters
                    </p>
                  </div>
                </div>
              ) : mcqPassed ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chapter.mcqs.length} questions • Test your knowledge
                  </p>
                  <div className="mt-2 rounded-md bg-green-100 p-3 dark:bg-green-900/30">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      ✅ MCQ passed successfully!
                    </p>
                    {displayResults?.score && (
                      <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                        Score: {displayResults.score}% •{" "}
                        {displayResults.correct_answers}/
                        {displayResults.total_questions} correct answers
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chapter.mcqs.length} questions • Test your knowledge
                </p>
              )}

              {/* Show lesson completion status */}
              {!allLessonsCompleted && (canAttemptMCQ || canRetryMCQ) && (
                <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                  Note: Complete all lessons for best results
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          {isLocked ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Complete previous chapter to unlock</span>
            </div>
          ) : mcqPassed ? (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>MCQ passed successfully!</span>
            </div>
          ) : hasFailedMCQ ? (
            <button
              onClick={() => onStartMCQ(chapter)}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4" />
              Retry MCQ Test{" "}
              {displayResults?.attempts_remaining &&
                `(${displayResults.attempts_remaining} attempts left)`}
            </button>
          ) : canAttemptMCQ ? (
            <button
              onClick={() => onStartMCQ(chapter)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <PlayCircle className="h-4 w-4" />
              {allLessonsCompleted ? "Start MCQ Test" : "Attempt MCQ Test"}
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Complete lessons to attempt MCQ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQSection;
