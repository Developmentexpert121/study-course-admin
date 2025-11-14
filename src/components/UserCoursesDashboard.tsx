"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  SearchIcon,
  Calendar,
  User,
  Tag,
  Play,
  Clock,
  Star,
  BookOpen,
  Award,
  Target,
  Eye,
  X,
  Users,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle,
  FileQuestion,
  Heart,
  Sparkles,
  TrendingUp,
  BarChart3,
  Filter,
  Grid3X3,
  List,
  Rocket,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDecryptedItem, truncateText } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { useDebounce } from "@/utils/debounce";
import { CourseMaintenanceMessage } from "./user/courses/CourseMaintenanceMessage";
import { useWishlist } from "@/hooks/useWishlist";

export default function UserCourseDashboard({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [role, setRole] = useState<any>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [limit] = useState(6);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    totalLearningHours: 0,
    averageProgress: 0,
  });

  const api = useApiClient();
  const loggedInuserId: any = getDecryptedItem("userId");

  // Use the wishlist hook
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const debouncedSearch = useDebounce((searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (course: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!loggedInuserId) {
      alert("Please login to add courses to wishlist");
      return;
    }

    const isCurrentlyInWishlist = isInWishlist(course.id);

    try {
      if (isCurrentlyInWishlist) {
        await removeFromWishlist(course.id);
      } else {
        await addToWishlist(course);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("limit", limit.toString());

      if (search && search.trim() !== "") {
        query.append("search", search.trim());
      }

      if (categoryFilter !== "all") {
        query.append("category", categoryFilter);
      }

      if (sortBy === "newest") query.append("sort", "-createdAt");
      if (sortBy === "oldest") query.append("sort", "createdAt");
      if (sortBy === "popular") query.append("sort", "-ratings");

      const url = `course/list?view_type=user&${query.toString()}`;

      const res = await api.get(url);

      if (res.success) {
        const coursesData = res.data?.data?.courses || [];
        const filteredCourses = coursesData.filter(
          (course: any) => course.status !== "draft",
        );
        setCourses(filteredCourses);

        setTotalPages(res.data?.data?.totalPages || 1);
        setTotalCourses(res.data?.data?.total || 0);

        const uniqueCategories = [
          ...new Set(
            filteredCourses
              .map((course: any) => course.category)
              .filter(Boolean),
          ),
        ] as string[];
        setCategories(uniqueCategories);

        // Calculate user stats from real data
        calculateUserStats(filteredCourses);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (coursesData: any[]) => {
    if (!loggedInuserId) return;

    const userEnrollments = coursesData.filter((course) =>
      course.enrolled_users?.some(
        (enrollment: any) => enrollment.user_id === parseInt(loggedInuserId),
      ),
    );

    const totalEnrolled = userEnrollments.length;

    // Calculate completed courses based on course readiness
    const completedCourses = userEnrollments.filter((course) => {
      const progress = course.course_readiness?.completion_percentage || 0;
      return progress >= 100 && course.is_course_complete;
    }).length;

    // Calculate total learning hours from enrolled courses (convert minutes to hours)
    const totalLearningMinutes = userEnrollments.reduce((total, course) => {
      return total + (course.totalDuration || 0);
    }, 0);

    const totalLearningHours = Math.round(totalLearningMinutes / 60);

    // Calculate average progress across all enrolled courses
    const totalProgress = userEnrollments.reduce((total, course) => {
      return total + (course.course_readiness?.completion_percentage || 0);
    }, 0);

    const averageProgress =
      userEnrollments.length > 0
        ? Math.round(totalProgress / userEnrollments.length)
        : 0;

    setUserStats({
      totalEnrolled,
      completedCourses,
      totalLearningHours,
      averageProgress,
    });
  };

  useEffect(() => {
    fetchCourses();
    const userRole = getDecryptedItem("role");
    setRole(userRole);
  }, [search, categoryFilter, sortBy, page]);

  const handleCourseClick = (course: any) => {
    if (course.status !== "active") {
      alert("This course is currently unavailable. Please check back later.");
      return;
    }

    if (course.is_course_complete !== true) {
      alert("This course is being prepared. Content will be available soon!");
      return;
    }

    router.push(`/user/courses/CourseEnrollment/${course.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCourseProgress = (course: any) => {
    return course.course_readiness?.completion_percentage || 0;
  };

  const isUser = role === "Student";
  const isEnrolled = (course: any) => {
    if (!loggedInuserId) return false;
    return (
      course.enrolled_users?.some(
        (enrollment: any) => enrollment.user_id === parseInt(loggedInuserId),
      ) || false
    );
  };

  const activeCourses = courses.filter(
    (course: any) => course.status === "active",
  );
  const inactiveCourses = courses.filter(
    (course: any) => course.status === "inactive",
  );

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
            page === i
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
              : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-blue-500"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  // Enhanced User Stats Section with real data from your API
  const userStatsData = [
    {
      title: "Enrolled Courses",
      value: userStats.totalEnrolled,
      icon: BookOpen,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "Courses you're taking",
    },
    {
      title: "Completed",
      value: userStats.completedCourses,
      icon: Award,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      description: "Courses finished",
    },
    {
      title: "Learning Hours",
      value: `${userStats.totalLearningHours}h`,
      icon: Clock,
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      description: "Total time invested",
    },
    {
      title: "Avg Progress",
      value: `${userStats.averageProgress}%`,
      icon: TrendingUp,
      color: "orange",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      description: "Across all courses",
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-6 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Learning Dashboard
                </h1>
              </div>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Discover new skills and continue your learning journey with our
                curated courses
              </p>
            </div>

            {!loading && inactiveCourses.length > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 dark:bg-orange-900/20">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="font-medium text-orange-700 dark:text-orange-300">
                  {inactiveCourses.length} course(s) coming soon
                </span>
              </div>
            )}
          </div>

          {/* Enhanced User Stats Section */}
          {!loading && isUser && userStats.totalEnrolled > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {userStatsData.map((stat, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${stat.bgGradient} dark:from-gray-900 dark:to-black`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                      </div>
                      <div
                        className={`rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-gray-700/50`}
                      >
                        <stat.icon
                          className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                        />
                      </div>
                    </div>
                    {stat.description && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-r ${stat.gradient} opacity-10`}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {/* Welcome message for new users */}
          {!loading && isUser && userStats.totalEnrolled === 0 && (
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-800">
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Start Your Learning Journey
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Explore our courses and enroll to begin tracking your
                    progress and achievements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filters and Controls */}
        <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              {/* Enhanced Search Bar */}
              <div className="relative w-full sm:w-80">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search courses by title, description..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Enhanced Category Filter */}
              {loading ? (
                <div className="h-12 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              ) : categories.length > 0 ? (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-8 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Enhanced Sort By */}
              <div className="relative">
                <BarChart3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-8 text-sm text-gray-900 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Enhanced View Mode Toggle */}
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-3 transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-3 transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Search Results Info */}
          {!loading && search && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Search results for:{" "}
                <span className="font-semibold">"{search}"</span>
                {activeCourses.length === 0 && " - No active courses found"}
              </div>
              <button
                onClick={clearSearch}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-8">
            <div className="mb-6">
              <div className="mb-4 h-8 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CourseListItemSkeleton key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Active Courses Section */}
            {activeCourses.length > 0 && (
              <div className="mb-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                    <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    Available Courses
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      {activeCourses.length}
                    </span>
                  </h3>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {activeCourses.map((course: any) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={isEnrolled(course)}
                        progress={getCourseProgress(course)}
                        onClick={() => handleCourseClick(course)}
                        onWishlistToggle={(e: React.MouseEvent) =>
                          handleWishlistToggle(course, e)
                        }
                        isInWishlist={isInWishlist(course.id)}
                        wishlistLoading={wishlistLoading}
                        formatDate={formatDate}
                        truncateText={truncateText}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCourses.map((course: any) => (
                      <CourseListItem
                        key={course.id}
                        course={course}
                        isEnrolled={isEnrolled(course)}
                        progress={getCourseProgress(course)}
                        onClick={() => handleCourseClick(course)}
                        onWishlistToggle={(e: React.MouseEvent) =>
                          handleWishlistToggle(course, e)
                        }
                        isInWishlist={isInWishlist(course.id)}
                        wishlistLoading={wishlistLoading}
                        formatDate={formatDate}
                        truncateText={truncateText}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Coming Soon Section (Inactive Courses) */}
            {inactiveCourses.length > 0 && (
              <div className="mb-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                    <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-2">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    Coming Soon
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {inactiveCourses.length}
                    </span>
                  </h3>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {inactiveCourses.map((course: any) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={isEnrolled(course)}
                        progress={getCourseProgress(course)}
                        onClick={() => handleCourseClick(course)}
                        onWishlistToggle={(e: React.MouseEvent) =>
                          handleWishlistToggle(course, e)
                        }
                        isInWishlist={isInWishlist(course.id)}
                        wishlistLoading={wishlistLoading}
                        formatDate={formatDate}
                        truncateText={truncateText}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inactiveCourses.map((course: any) => (
                      <CourseListItem
                        key={course.id}
                        course={course}
                        isEnrolled={isEnrolled(course)}
                        progress={getCourseProgress(course)}
                        onClick={() => handleCourseClick(course)}
                        onWishlistToggle={(e: React.MouseEvent) =>
                          handleWishlistToggle(course, e)
                        }
                        isInWishlist={isInWishlist(course.id)}
                        wishlistLoading={wishlistLoading}
                        formatDate={formatDate}
                        truncateText={truncateText}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {courses.length === 0 && <EmptyState search={search} />}

            {/* Enhanced Pagination */}
            {courses.length > 0 && (
              <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 sm:flex-row">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {activeCourses.length} active courses
                  {inactiveCourses.length > 0 &&
                    ` and ${inactiveCourses.length} coming soon`}
                  {search && ` for "${search}"`}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {generatePaginationButtons()}
                  </div>
                  <button
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// The CourseCard, CourseListItem, CourseCardSkeleton, CourseListItemSkeleton, and EmptyState components remain exactly the same as in the previous implementation
// [Include all the same helper components here...]

// Enhanced Course Card Component
const CourseCard = ({
  course,
  isEnrolled,
  onClick,
  onWishlistToggle,
  isInWishlist,
  wishlistLoading,
  formatDate,
  truncateText,
}: any) => {
  const isActive = course.status === "active";
  const isInactive = course.status === "inactive";
  const isCourseComplete = course.is_course_complete === true;
  const progress = course.course_readiness?.completion_percentage || 0;

  const getCourseStatus = (course: any) => {
    const isActive = course.status === "active";
    const isInactive = course.status === "inactive";
    const isCourseComplete = course.is_course_complete === true;

    if (isInactive) {
      return { status: "inactive", label: "Coming Soon", color: "gray" };
    }

    if (isActive) {
      if (isCourseComplete) {
        return { status: "ready", label: "Ready", color: "green" };
      } else {
        return {
          status: "under_development",
          label: "Under Development",
          color: "orange",
        };
      }
    }

    return { status: "unknown", label: "Unknown", color: "gray" };
  };

  const courseStatus = getCourseStatus(course);
  const isCourseAvailable = isActive && isCourseComplete;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 ${
        isCourseAvailable && !isEnrolled
          ? "cursor-pointer hover:-translate-y-1"
          : "cursor-default"
      }`}
      onClick={() => !isEnrolled && isCourseAvailable && onClick()}
    >
      {/* Course Image with Gradient Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        {/* Progress Bar for enrolled users */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/80 dark:bg-gray-700/80">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
              courseStatus.color === "gray"
                ? "bg-gray-900/80 text-white"
                : courseStatus.color === "orange"
                  ? "bg-orange-500/90 text-white"
                  : "bg-green-500/90 text-white"
            }`}
          >
            {courseStatus.status === "inactive" && <Lock className="h-3 w-3" />}
            {courseStatus.status === "under_development" && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {courseStatus.status === "ready" && (
              <CheckCircle className="h-3 w-3" />
            )}
            {courseStatus.label}
          </span>

          {isEnrolled && (
            <span className="rounded-full bg-blue-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Enrolled
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute right-4 top-4 rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 ${
            isInWishlist
              ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
              : "bg-white/90 text-gray-600 shadow-lg hover:bg-white hover:text-red-500"
          } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          )}
        </button>

        {/* Price Badge */}
        <div className="absolute right-4 top-16">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
              course.price_type === "free"
                ? "bg-green-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {course.price_type === "free" ? "FREE" : `$${course.price}`}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Category and Rating */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Tag className="mr-1 h-3 w-3" />
            {course.category || "Uncategorized"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {course.ratings?.average_rating?.toFixed(1) ||
                course.average_rating?.toFixed(1) ||
                "0.0"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({course.ratings?.total_ratings || course.total_ratings || 0})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {truncateText(course.description || "No description available", 100)}
        </p>

        {/* Meta Information */}
        <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{course.creator?.username || course.creator}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(course.createdAt)}</span>
          </div>
          {course.duration && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        {/* Course Stats */}
        {course.has_chapters && (
          <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <BookOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {course.totalChapters || 0} chapters
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <Play className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {course.totalLessons || 0} lessons
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <FileQuestion className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {course.totalMCQs || 0} MCQs
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <Users className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {course.enrollment_count || 0} enrolled
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          {isEnrolled ? (
            <>
              {/* Enrolled + Continue Buttons (Same Line) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  Enrolled
                </span>

                <button
                  onClick={onClick}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Play className="h-4 w-4" />
                  Continue
                </button>
              </div>

              {/* Progress Below Buttons */}
              {/* <div className="mt-2">
                <div className="flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div> */}
            </>
          ) : (
            // For not enrolled
            <button
              onClick={() => isCourseAvailable && onClick()}
              disabled={!isCourseAvailable}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isCourseAvailable
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  : "cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {isInactive ? (
                <>
                  <Lock className="h-4 w-4" />
                  Coming Soon
                </>
              ) : !isCourseComplete ? (
                <>Preparing</>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View Details
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Course List Item Component
const CourseListItem = ({
  course,
  isEnrolled,
  onClick,
  onWishlistToggle,
  isInWishlist,
  wishlistLoading,
  formatDate,
  truncateText,
}: any) => {
  const isActive = course.status === "active";
  const isInactive = course.status === "inactive";
  const isCourseComplete = course.is_course_complete === true;
  const progress = course.course_readiness?.completion_percentage || 0;

  return (
    <div
      className={`group flex items-start gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
        isActive && isCourseComplete && !isEnrolled
          ? "cursor-pointer hover:-translate-y-0.5"
          : "cursor-default"
      }`}
      onClick={() => !isEnrolled && isActive && isCourseComplete && onClick()}
    >
      {/* Course Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute right-2 top-2 rounded-full p-1.5 backdrop-blur-sm transition-all duration-300 ${
            isInWishlist
              ? "bg-red-500 text-white shadow-md hover:bg-red-600"
              : "bg-white/90 text-gray-600 shadow-md hover:bg-white hover:text-red-500"
          } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {wishlistLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart
              className={`h-3 w-3 ${isInWishlist ? "fill-current" : ""}`}
            />
          )}
        </button>
      </div>

      {/* Course Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {course.category || "Uncategorized"}
              </span>
              {isInactive && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Coming Soon
                </span>
              )}
              {isEnrolled && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Enrolled
                </span>
              )}
              {isActive && !isCourseComplete && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <AlertCircle className="h-3 w-3" />
                  Preparing
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  course.price_type === "free"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {course.price_type === "free" ? "FREE" : `$${course.price}`}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {course.title}
            </h3>

            <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
              {truncateText(
                course.description || "No description available",
                200,
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{course.creator_name || course.creator}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {course.ratings?.average_rating?.toFixed(1) ||
                    course.average_rating?.toFixed(1) ||
                    "0.0"}
                </span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-2">
            {isEnrolled ? (
              <>
                <span className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  Enrolled
                </span>
                <button
                  onClick={onClick}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Play className="h-4 w-4" />
                  Continue
                </button>
              </>
            ) : (
              <button
                onClick={onClick}
                disabled={!isActive || !isCourseComplete}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive && isCourseComplete
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    : "cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {isInactive ? (
                  <>
                    <Loader2 className="h-4 w-4" />
                    Coming Soon
                  </>
                ) : !isCourseComplete ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Preparing
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    View Details
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar for enrolled users */}
        {isEnrolled && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Your Progress
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Course Card Skeleton Component
const CourseCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div className="h-48 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-3 rounded bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="h-11 w-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-9 w-14 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </div>
);

// Enhanced Course List Item Skeleton Component
const CourseListItemSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-start gap-6">
      <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-3 flex flex-wrap items-center gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-11 w-36 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-11 w-44 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Empty State Component
const EmptyState = ({ search }: any) => (
  <div className="col-span-full py-16 text-center">
    <div className="mx-auto max-w-md">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-800 dark:to-gray-700">
        <SearchIcon className="mx-auto h-16 w-16 text-gray-400" />
      </div>
      <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
        {search ? "No courses found" : "No courses available"}
      </h3>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        {search
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "New courses are being added regularly. Check back soon!"}
      </p>
      {search && (
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Clear Search & Show All
        </button>
      )}
    </div>
  </div>
);
