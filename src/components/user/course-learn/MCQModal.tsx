// components/course-learn/MCQModal.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  Award,
  Star,
} from "lucide-react";

interface MCQModalProps {
  show: boolean;
  chapter: any | null;
  userAnswers: { [mcqId: number]: number };
  submittingMCQ: boolean;
  onAnswerSelect: (mcqId: number, optionIndex: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const MCQModal: React.FC<MCQModalProps> = ({
  show,
  chapter,
  userAnswers,
  submittingMCQ,
  onAnswerSelect,
  onSubmit,
  onClose,
}) => {
  const [shuffledMCQs, setShuffledMCQs] = useState<any[]>([]);

  useEffect(() => {
    if (show && chapter) {
      // Only shuffle questions, keep options in original order
      const shuffledQuestions = shuffleArray([...chapter.mcqs]);
      setShuffledMCQs(shuffledQuestions);
    }
  }, [show, chapter]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (!show) {
      setShuffledMCQs([]);
    }
  }, [show]);

  if (!show || !chapter || shuffledMCQs.length === 0) return null;

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = shuffledMCQs.length;
  const allAnswersSelected = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (allAnswersSelected) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
 
      {/* Enhanced Modal */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Chapter {chapter.order} Assessment
                </h2>
                <p className="mt-1 flex items-center gap-2 text-blue-100">
                  <Star className="h-4 w-4" />
                  Test your knowledge from "{chapter.title}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Shuffle className="h-4 w-4" />
                <span>Randomized Questions</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-3 text-white/80 transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-8 py-4 dark:border-slate-700 dark:bg-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Progress: {answeredCount}/{totalQuestions} completed
            </span>
            <div className="flex items-center gap-4">
              <div className="w-48 rounded-full bg-slate-200 dark:bg-slate-600">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                  }}
                />
              </div>
              {!allAnswersSelected && (
                <span className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                  <AlertCircle className="h-4 w-4" />
                  Complete all questions
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Questions */}
        <div className="max-h-96 overflow-y-auto p-8">
          <div className="space-y-6">
            {shuffledMCQs.map((mcq, index) => (
              <div
                key={mcq.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-blue-500"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-lg font-medium text-slate-900 dark:text-white">
                    {mcq.question}
                  </p>
                  {userAnswers[mcq.id] !== undefined && (
                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Answered
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Render options in their original order - DO NOT SHUFFLE */}
                  {mcq.options.map((option: any, optIndex: any) => (
                    <label
                      key={optIndex}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        userAnswers[mcq.id] === optIndex
                          ? "border-blue-300 bg-blue-50 shadow-md dark:border-blue-600 dark:bg-blue-900/20"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${mcq.id}`}
                        checked={userAnswers[mcq.id] === optIndex}
                        onChange={() => onAnswerSelect(mcq.id, optIndex)}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      />
                      <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  50% passing score required
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={submittingMCQ}
                className="rounded-xl border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:shadow-lg disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allAnswersSelected || submittingMCQ}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingMCQ ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Assessment...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5" />
                    Submit Assessment
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQModal;
