// components/learning-paths/LearningPathList.tsx
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Users, Star, ArrowRight, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";

export default function LearningPathList() {
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({
    category: "",
    difficulty: "",
    search: "",
  });

  const api = useApiClient();
  const router = useRouter();

  useEffect(() => {
    fetchLearningPaths();
  }, [filters]);

  const fetchLearningPaths = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(filters);

      if (response.success) {
        setLearningPaths(response.data.learningPaths);
      } else {
        setError("Failed to fetch learning paths");
      }
    } catch (error) {
      console.error("Failed to fetch learning paths:", error);
      setError("Unable to load learning paths. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.round(hours / 24)}d`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleFilterChange = (key: any, value: string): void => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handlePathClick = (pathId: number): void => {
    router.push(`/learning-paths/${pathId}`);
  };

  const clearFilters = (): void => {
    setFilters({
      category: "",
      difficulty: "",
      search: "",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-2 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium text-red-800 dark:text-red-200">
            Error Loading Paths
          </h3>
          <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchLearningPaths}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search learning paths..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="design">Design</option>
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {(filters.category || filters.difficulty || filters.search) && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <div
            key={path.id}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            onClick={() => handlePathClick(path.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handlePathClick(path.id);
              }
            }}
          >
            {path.image ? (
              <img
                src={path.image}
                alt={path.title}
                className="h-48 w-full rounded-t-lg object-cover"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gray-100 dark:bg-gray-700">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(path.difficulty)}`}
                >
                  {path.difficulty.charAt(0).toUpperCase() +
                    path.difficulty.slice(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {path.courses?.length || 0} courses
                </span>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                {path.title}
              </h3>

              <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {path.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(path.estimated_duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{path.courses?.length || 0}</span>
                  </div>
                  {path.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{path.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {learningPaths.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No learning paths found
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Try adjusting your search filters or check back later for new paths.
          </p>
          {(filters.category || filters.difficulty || filters.search) && (
            <button
              onClick={clearFilters}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
