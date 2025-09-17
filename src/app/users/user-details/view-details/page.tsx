"use client";

import { ArrowLeft, Calendar, Trophy, Target, TrendingUp, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface UserData {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    verified: boolean;
    created_at: string;
  };
  total_enrolled_courses: number;
  enrolled_courses: CourseData[];
  overall_progress: {
    total_chapters: number;
    total_passed_chapters: number;
    overall_percentage: number;
  };
  mcq_statistics: {
    total_mcq_attempts: number;
    total_passed_mcqs: number;
    total_failed_mcqs: number;
    pass_rate: number;
  };
  all_passed_mcqs: McqAttempt[];
  course_summary: {
    completed_courses: number;
    in_progress_courses: number;
    not_started_courses: number;
  };
  message: string;
}

interface CourseData {
  course_id: number;
  course_title: string;
  course_image: string;
  course_description: string;
  enrollment_date: string;
  total_chapters: number;
  total_passed_chapters: number;
  total_mcqs_in_course: number;
  completion_percentage: number;
  progress_status: string;
  passed_chapters: PassedChapter[];
  all_mcq_attempts: McqAttempt[];
  total_mcq_attempts: number;
  passed_mcq_attempts: number;
  failed_mcq_attempts: number;
}

interface PassedChapter {
  chapter_id: number;
  chapter_title: string;
  chapter_order: number;
  course_id: number;
  course_title: string;
  passed_at: string;
  score: number;
  total_questions: number;
  percentage: number;
  submission_id: number;
}

interface McqAttempt {
  mcq_submission_id: number;
  course_id: number;
  course_title: string;
  chapter_id: number;
  chapter_title: string;
  chapter_order: number;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  submitted_at: string;
  status: string;
}

export default function UserCompleteDetailsPage({ className }: any) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();

  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'mcqs'>('overview');

  useEffect(() => {
    if (!userId) return;
    
    async function fetchDetails() {
      try {
        const res = await api.get(`mcq/complete-details/${userId}`);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching user details", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600 dark:text-gray-400">No user found.</p>
      </div>
    );
  }

  const { user, enrolled_courses, overall_progress, mcq_statistics, course_summary, all_passed_mcqs } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'not_started':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Complete Details</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.username}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Role:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  user.verified 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  {user.verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Joined {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Enrolled Courses</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {data.total_enrolled_courses}
              </p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Passed MCQs</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {mcq_statistics.total_passed_mcqs}
              </p>
            </div>
            <Trophy className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Overall Progress</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {overall_progress.overall_percentage}%
              </p>
            </div>
            <Target className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Pass Rate</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {mcq_statistics.pass_rate}%
              </p>
            </div>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'courses', label: 'Courses' },
            { id: 'mcqs', label: 'MCQ History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Progress Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {overall_progress.total_passed_chapters}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Chapters Completed</div>
                <div className="text-xs text-gray-500">of {overall_progress.total_chapters} total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {course_summary.completed_courses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
                <div className="text-xs text-gray-500">of {data.total_enrolled_courses} enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {mcq_statistics.total_mcq_attempts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total MCQ Attempts</div>
                <div className="text-xs text-gray-500">{mcq_statistics.total_passed_mcqs} passed</div>
              </div>
            </div>
          </div>

          {/* Course Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {course_summary.completed_courses}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {course_summary.in_progress_courses}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">In Progress</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {course_summary.not_started_courses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Not Started</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          {enrolled_courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No enrolled courses found.</p>
            </div>
          ) : (
            enrolled_courses.map((course) => (
              <div key={course.course_id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-6">
                  <img 
                    src={course.course_image || '/api/placeholder/80/80'} 
                    alt={course.course_title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {course.course_title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {course.course_description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Enrolled on {formatDate(course.enrollment_date)}
                        </p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getStatusColor(course.progress_status)
                      )}>
                        {course.progress_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{course.total_passed_chapters}/{course.total_chapters} chapters</span>
                        <span>{course.completion_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.total_mcq_attempts}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">MCQ Attempts</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {course.passed_mcq_attempts}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Passed</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {course.failed_mcq_attempts}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
                      </div>
                    </div>

                    {/* Passed Chapters */}
                    {course.passed_chapters.length > 0 && (
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Passed Chapters</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {course.passed_chapters.map((chapter) => (
                            <div
                              key={chapter.chapter_id}
                              className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-2 rounded-lg text-sm"
                            >
                              <div className="font-medium">{chapter.chapter_title}</div>
                              <div className="text-xs">
                                Score: {chapter.score}/{chapter.total_questions} ({chapter.percentage}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'mcqs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">MCQ Attempt History</h3>
            {all_passed_mcqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No MCQ attempts found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Course & Chapter
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {all_passed_mcqs.map((attempt) => (
                      <tr key={attempt.mcq_submission_id}>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {attempt.course_title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {attempt.chapter_title}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {attempt.score}/{attempt.total_questions}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {attempt.percentage}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            attempt.passed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          )}>
                            {attempt.passed ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {attempt.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(attempt.submitted_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}