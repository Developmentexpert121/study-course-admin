"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, Eye, Code, Play } from "lucide-react";
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

  const fetchCodingQuestions = async (course_id?: number) => {
    if (!course_id) {
      console.log("No course ID provided");
      setCodingQuestions([]);
      return;
    }

    setLoading(true);
    try {
    

      const res = await api.get(`coding/code-question?course_id=${course_id}`);
      
      console.log("📥 API Response:", res?.data?.data?.data);

      if (res.success) {
        setCodingQuestions( res?.data?.data?.data|| []);
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

  // Fetch data when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchCodingQuestions(courseId);
    }
  }, [courseId]);

  const handleEdit = (id: number) => {
    router.push(`/coding/edit-coding-question?id=${id}&course_id=${courseId}`);
  };

  const handleView = (id: number) => {
    router.push(`/coding/view-coding-question?id=${id}&course_id=${courseId}`);
  };

  const handleTest = (id: number) => {
    router.push(`/coding/test-coding-question?id=${id}&course_id=${courseId}`);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await api.put(`coding/${id}/status`, {
        is_active: !currentStatus
      });
      
      if (response.success) {
        toasterSuccess(
          `Coding question ${!currentStatus ? "activated" : "deactivated"} successfully`, 
          3000, 
          "status-toggle"
        );
        if (courseId) {
          await fetchCodingQuestions(courseId);
        }
      } else {
        toasterError(response.error?.code || "Operation failed", 3000, "status-toggle");
      }
    } catch (error) {
      console.log("Failed to toggle status:", error);
      toasterError("Failed to update status", 3000, "status-toggle");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this coding question?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`coding/${id}`);
      if (response.success) {
        toasterSuccess("Coding question deleted successfully", 3000, "delete-success");
        if (courseId) {
          await fetchCodingQuestions(courseId);
        }
      } else {
        toasterError(response.error?.code || "Delete failed", 3000, "delete-error");
      }
    } catch (error) {
      console.log("Failed to delete coding question:", error);
      toasterError("Failed to delete coding question", 3000, "delete-error");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const formatDescription = (description: string) => {
    if (!description) return 'No description';
    // Remove HTML tags and limit to 80 characters
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > 80 ? `${plainText.slice(0, 80)}...` : plainText;
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Coding Questions {filteredQuestions.length > 0 && `(${filteredQuestions.length})`}
        </h2>
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
          <button
            onClick={() => router.push(`/coding/code-question?course_id=${courseId}`)}
            className="w-full sm:w-auto rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
            disabled={!courseId}
          >
            <Code className="inline mr-2" size={16} />
            Add Question
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading coding questions...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="!text-left">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Test Cases</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question: any) => (
                <TableRow
                  className="text-center text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  key={question.id}
                >
                  <TableCell className="!text-left font-semibold max-w-[200px]">
                    <div className="truncate" title={question.title}>
                      {question.title || 'Untitled'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={question.description?.replace(/<[^>]*>/g, '')}>
                      {formatDescription(question.description)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty || 'Medium'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {question.test_cases?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                      {question.allowed_languages?.slice(0, 2).map((lang: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {lang}
                        </span>
                      ))}
                      {question.allowed_languages?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{question.allowed_languages.length - 2}
                        </span>
                      )}
                      {(!question.allowed_languages || question.allowed_languages.length === 0) && (
                        <span className="text-gray-400 text-xs">No languages</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {question.Chapter?.title || 'No Chapter'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.is_active)}`}>
                      {question.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {question.createdAt ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(question.createdAt)) : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => handleView(question.id)}
                        title="View Question"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-50 transition-colors"
                        onClick={() => handleTest(question.id)}
                        title="Test Question"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 p-1.5 rounded hover:bg-yellow-50 transition-colors"
                        onClick={() => handleEdit(question.id)}
                        title="Edit Question"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className={`p-1.5 rounded transition-colors ${
                          question.is_active 
                            ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                        }`}
                        onClick={() => handleToggleStatus(question.id, question.is_active)}
                        title={question.is_active ? "Deactivate" : "Activate"}
                      >
                        {question.is_active ? '⏸️' : '▶️'}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(question.id)}
                        title="Delete Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Code className="h-12 w-12 text-gray-400" />
                    <div className="text-gray-500 dark:text-gray-400">
                      {search || difficultyFilter ? 'No coding questions match your filters' : 'No coding questions found'}
                    </div>
                    {(!search && !difficultyFilter && courseId) && (
                      <button
                        onClick={() => router.push(`/coding/code-question?course_id=${courseId}`)}
                        className="mt-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                      >
                        Create First Question
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Results Summary */}
      {!loading && filteredQuestions.length > 0 && (search || difficultyFilter) && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredQuestions.length} of {codingQuestions.length} coding questions
        </div>
      )}
    </div>
  );
}