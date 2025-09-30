"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Play, 
  Clock, 
  Cpu, 
  Lightbulb, 
  ChevronLeft, 
  CheckCircle, 
  XCircle,
  Code2,
  History
} from "lucide-react";
import api from "@/lib/api";
import Cookies from "js-cookie";

// Types based on your API response
interface TestCase {
  id: number;
  input: string;
  is_sample: boolean;
  expected_output: string;
}

interface QuestionData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  test_cases: TestCase[];
  starter_code: {
    [key: string]: string;
  };
  allowed_languages: string[];
  time_limit: number;
  memory_limit?: number;
  course_id: number;
  chapter_id: number;
  hints: string[];
  tags: string[];
  is_active: boolean;
}

export default function CodingQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const chapterId = searchParams.get("chapter_id");
  const question_id = searchParams.get("questionId");
  
  console.log("object,questionId", question_id);

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sourceCode, setSourceCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("problem");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState({
    best_score: 0,
    total_attempts: 0,
    is_completed: false
  });

  // Mock data for hints and submissions (replace with actual API calls)
  const [hints] = useState({
    revealed: [] as string[], // You can implement hint revealing logic
    available: 0,
    remaining: 0
  });

  const [recentSubmissions] = useState<any[]>([]); // Replace with actual submissions data

  // Fetch question data
  const fetchQuestion = async (questionId: string) => {
    if (!questionId) return;
    
    try {
      setLoading(true);
      
      // Call your getCodingQuestionForUser API
      const res = await api.get(`coding/code-question/${questionId}`);
      
      console.log("🔍 API Response:", res.data?.data);

      if (res.data.success) {
        // Directly set the question data from API response
        const question = res.data.data;
        setQuestionData(question);
        
        // Set initial code from starter_code
        if (question && question.starter_code && question.starter_code[selectedLanguage]) {
          setSourceCode(question.starter_code[selectedLanguage]);
        } else if (question && question.starter_code && Object.keys(question.starter_code).length > 0) {
          // Fallback to first available language
          const firstLanguage = Object.keys(question.starter_code)[0];
          setSelectedLanguage(firstLanguage);
          setSourceCode(question.starter_code[firstLanguage]);
        }

        // Initialize hints data
        if (question.hints && question.hints.length > 0) {
          // You can implement logic to determine which hints are revealed
          // For now, showing no hints by default
        }
      }
    } catch (err) {
      console.error("❌ Failed to fetch question:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question_id) {
      fetchQuestion(question_id);
    }
  }, [question_id]);

  // Handle code submission
  const handleSubmitCode = async () => {
    if (!questionData || !sourceCode.trim() || !courseId || !chapterId) return;

    try {
      setSubmitting(true);
      const userId = Cookies.get("userId");

      if (!userId) {
        alert("User not authenticated");
        return;
      }

      const submissionData = {
        user_id: userId,
        chapter_id: parseInt(chapterId),
        coding_question_id: questionData.id, // Use questionData.id directly
        source_code: sourceCode,
        language: selectedLanguage
      };

      const res = await api.post("/coding/submit", submissionData);

      if (res.data.success) {
        setTestResults(res.data.data.test_results || []);
        setActiveTab("results");
        
        // Refresh question data to update progress
        await fetchQuestion(question_id!);
        
        // Show success message
        if (res.data.data.passed) {
          alert("🎉 Congratulations! All test cases passed!");
        }
      }
    } catch (err) {
      console.error("❌ Failed to submit code:", err);
      alert("Failed to submit code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle run code
  const handleRunCode = async () => {
    alert("Run feature coming soon!");
  };

  // Reset code to starter template
  const handleResetCode = () => {
    if (questionData?.starter_code[selectedLanguage]) {
      setSourceCode(questionData.starter_code[selectedLanguage]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Question not found</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {questionData.title}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    questionData.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : questionData.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {questionData.difficulty.charAt(0).toUpperCase() + questionData.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    • {questionData.tags.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {userProgress.best_score}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {userProgress.total_attempts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Attempts</div>
              </div>
              {userProgress.is_completed && (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Statement & Hints */}
          <div className="space-y-6">
            {/* Problem Statement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Problem Statement
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{questionData.time_limit}ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="w-4 h-4" />
                    <span>{Math.round((questionData.memory_limit || 64000) / 1000)}MB</span>
                  </div>
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <div 
                  className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: questionData.description.replace(/\n/g, '<br/>') 
                  }}
                />
              </div>

              {/* Sample Test Cases */}
              {questionData.test_cases.filter(tc => tc.is_sample).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Sample Test Cases
                  </h3>
                  <div className="space-y-3">
                    {questionData.test_cases
                      .filter(tc => tc.is_sample)
                      .map((testCase, index) => (
                        <div key={testCase.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Input:</h4>
                              <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded mt-1">
                                {testCase.input}
                              </pre>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Expected Output:</h4>
                              <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded mt-1">
                                {testCase.expected_output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hints */}
            {hints.revealed.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hints ({hints.revealed.length}/{hints.available})
                  </h3>
                </div>
                <div className="space-y-3">
                  {hints.revealed.map((hint, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {hint}
                      </p>
                    </div>
                  ))}
                </div>
                {hints.remaining > 0 && (
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {hints.remaining} more hint{hints.remaining !== 1 ? 's' : ''} available. Make more attempts to unlock them.
                  </p>
                )}
              </div>
            )}

            {/* Recent Submissions */}
            {recentSubmissions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <History className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Submissions
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentSubmissions.map((submission) => (
                    <div 
                      key={submission.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {submission.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium capitalize">{submission.language}</span>
                        {submission.execution_time && (
                          <span className="text-xs text-gray-500">{submission.execution_time}ms</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          submission.passed ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {submission.score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor & Results */}
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Language:
                  </span>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    const newLanguage = e.target.value;
                    setSelectedLanguage(newLanguage);
                    // Update code editor with new starter code
                    if (questionData.starter_code[newLanguage]) {
                      setSourceCode(questionData.starter_code[newLanguage]);
                    } else {
                      setSourceCode(`// No starter code available for ${newLanguage}`);
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {questionData.allowed_languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Code Editor
                  </h3>
                  <button
                    onClick={handleResetCode}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Reset Code
                  </button>
                </div>
              </div>
              
              <div className="p-1">
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  spellCheck="false"
                  placeholder={`Write your ${selectedLanguage} code here...`}
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={handleRunCode}
                    disabled={submitting || !sourceCode.trim()}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                  </button>
                  
                  <button
                    onClick={handleSubmitCode}
                    disabled={submitting || !sourceCode.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {activeTab === "results" && testResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Test Results
                </h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium">Test Case {index + 1}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {result.execution_time}ms • {result.memory_used}KB
                        </div>
                      </div>
                      {result.error && (
                        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm font-mono text-red-700 dark:text-red-300">
                          {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}