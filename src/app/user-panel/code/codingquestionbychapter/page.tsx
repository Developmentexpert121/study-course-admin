"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, Eye, Code, FileText, Clock } from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";

export default function CodingQuestions({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [codingQuestions, setCodingQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const chapterId = searchParams.get("chapter_id");
  const question_id = searchParams.get("questionId")

  const fetchCodingQuestions = async (course_id?: number) => {
    if (!course_id) {
      console.log("No course ID provided");
      setCodingQuestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`coding/code-question?course_id=${course_id}&question_id=${question_id}`);
      
      console.log("📥 API Response:", res?.data?.data?.data);

      if (res.success) {
        setCodingQuestions(res?.data?.data?.data || []);
        console.log("✅ Questions loaded:", res.data?.length || 0);
      } else {
        toasterError(res.message || "Failed to load coding questions", 3000, "fetch-error");
        setCodingQuestions([]);
      }
    } catch (err: any) {
      console.log("❌ Failed to fetch coding questions:", err);
      toasterError(
        err?.response?.data?.message || 
        err?.message || 
        "Failed to load coding questions", 
        3000, 
        "fetch-error"
      );
      setCodingQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering logic
  const filteredQuestions = codingQuestions.filter((question: any) => {
    // Filter by search term (title or description)
    const matchesSearch = !search || 
      question.title?.toLowerCase().includes(search.toLowerCase()) ||
      question.description?.toLowerCase().includes(search.toLowerCase());
    
    // Filter by difficulty
    const matchesDifficulty = !difficultyFilter || 
      question.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    
    return matchesSearch && matchesDifficulty;
  });

  // Filter questions by chapter_id if provided
  const chapterQuestions = chapterId 
    ? filteredQuestions.filter((question: any) => question.chapter_id == chapterId)
    : filteredQuestions;

  // Fetch data when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchCodingQuestions(courseId);
    }
  }, [courseId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDescription = (description: string) => {
    if (!description) return 'No description available';
    // Remove HTML tags and limit to 120 characters
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > 120 ? `${plainText.slice(0, 120)}...` : plainText;
  };

  const formatTimeLimit = (timeLimit: number) => {
    if (!timeLimit) return 'No limit';
    return `${timeLimit} minute${timeLimit !== 1 ? 's' : ''}`;
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Coding Questions 
          </h2>
          {chapterQuestions.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {chapterQuestions.length} question{chapterQuestions.length !== 1 ? 's' : ''} found
              {chapterId && ` in this chapter`}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-full border border-gray-300 bg-gray-50 py-2.5 px-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search coding questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={16} />
          </div>

          {/* Add Coding Question Button */}
        
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading coding questions...</span>
        </div>
      )}

      {/* Questions Grid */}
      {!loading && (
        <div className="space-y-6">
          {chapterQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterQuestions.map((question: any) => (
                <div 
                  key={question.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 p-5"
                >
                  {/* Header with difficulty and actions */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty || 'Medium'}
                    </span>
                 
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
                    {question.title || 'Untitled Question'}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 h-16">
                    {formatDescription(question.description)}
                  </p>

                  {/* Content */}
                  <div className="space-y-3 mb-4">
                    {/* Time Limit */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>{formatTimeLimit(question.time_limit)}</span>
                    </div>

                    {/* Languages */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FileText size={14} />
                        <span>Languages:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {question.allowed_languages?.slice(0, 4).map((lang: string, index: number) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs"
                          >
                            {lang}
                          </span>
                        ))}
                        {question.allowed_languages?.length > 4 && (
                          <span className="inline-flex items-center rounded-full border border-gray-300 text-gray-700 px-2 py-1 text-xs">
                            +{question.allowed_languages.length - 4}
                          </span>
                        )}
                        {(!question.allowed_languages || question.allowed_languages.length === 0) && (
                          <span className="text-xs text-gray-400">No languages specified</span>
                        )}
                      </div>
                    </div>

                    {/* Memory Limit */}
                 
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {question.created_at && new Date(question.created_at).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => router.push(`/user-panel/code/solv-code?questionId=${question.id}&?course_id=${courseId}&chapterId=${question.chapter_id}`)}
                      className="inline-flex items-center gap-1 rounded-full border border-green-600 bg-white text-green-600 px-3 py-1.5 text-sm font-medium hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Code className="h-16 w-16 text-gray-400" />
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  {search || difficultyFilter ? 'No coding questions match your filters' : 'No coding questions found'}
                </div>
                {(!search && !difficultyFilter && courseId) && (
                  <button
                    onClick={() => router.push(`/coding/code-question?course_id=${courseId}${chapterId ? `&chapter_id=${chapterId}` : ''}`)}
                    className="mt-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    Create First Question
                  </button>
                )}
                {(search || difficultyFilter) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setDifficultyFilter('');
                    }}
                    className="mt-2 rounded-full bg-gray-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {!loading && chapterQuestions.length > 0 && (search || difficultyFilter) && (
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {chapterQuestions.length} of {filteredQuestions.length} coding questions
          {(search || difficultyFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setDifficultyFilter('');
              }}
              className="ml-2 text-green-600 hover:text-green-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}