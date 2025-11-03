"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback, useRef } from "react";
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
  FileText,
  Wrench,
  Heart,
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
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]); // Fixed: should be array, not string
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
    learningTime: 0,
    currentStreak: 0,
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
    e.stopPropagation(); // Prevent triggering course click

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

      // Only add search if it's not empty
      if (search && search.trim() !== "") {
        query.append("search", search.trim());
      }

      // Add category filter
      if (categoryFilter !== "all") {
        query.append("category", categoryFilter);
      }

      // TEMPORARY FIX: Use backend-expected sort parameters
      if (sortBy === "newest") query.append("sort", "-createdAt");
      if (sortBy === "oldest") query.append("sort", "createdAt");
      if (sortBy === "popular") query.append("sort", "-ratings");

      const url = `course/list?${query.toString()}`;

      const res = await api.get(url);

      if (res.success) {
        const coursesData = res.data?.data?.courses || [];

        // Filter out draft courses and only show active/inactive
        const filteredCourses = coursesData.filter(
          (course: any) => course.status !== "draft",
        );
        setCourses(filteredCourses);
        setTotalPages(res.data?.data?.totalPages || 1);
        setTotalCourses(res.data?.data?.total || 0);

        // Fixed: Extract enrolled courses properly
        const userEnrollments = filteredCourses
          .filter((course: any) =>
            course.enrolled_users?.some(
              (enrollment: any) =>
                enrollment.user_id === parseInt(loggedInuserId),
            ),
          )
          .map((course: any) => ({
            courseId: course.id,
            progress:
              course.enrolled_users?.find(
                (enrollment: any) =>
                  enrollment.user_id === parseInt(loggedInuserId),
              )?.progress || 0,
          }));
        setEnrolledCourses(userEnrollments);

        // Extract unique categories from courses
        const uniqueCategories = [
          ...new Set(
            filteredCourses
              .map((course: any) => course.category)
              .filter(Boolean),
          ),
        ] as string[];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    const userRole = getDecryptedItem("role");
    setRole(userRole);
  }, [search, categoryFilter, sortBy, page]);

  const handleCourseClick = (course: any) => {
    // Check if course is active and has chapters
    if (course.status !== "active") {
      // Show modal or toast message for inactive courses
      alert("This course is currently unavailable. Please check back later.");
      return;
    }

    if (!course.has_chapters) {
      // Show modal or toast message for courses without content
      alert("This course is being prepared. Content will be available soon!");
      return;
    }

    // For active courses with chapters, go to enrollment page
    router.push(`/user-panel/courses/CourseEnrollment/${course.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fixed: Get course progress function
  const getCourseProgress = (courseId: number) => {
    const enrolledCourse: any = enrolledCourses.find(
      (course: any) => course.courseId === courseId,
    );
    return enrolledCourse ? enrolledCourse.progress || 0 : 0;
  };

  const isUser = role === "user";
  const isEnrolled = (course: any) => {
    if (!loggedInuserId) return false;

    // Check if current user is in the enrolled_users array
    return (
      course.enrolled_users?.some(
        (enrollment: any) => enrollment.user_id === parseInt(loggedInuserId),
      ) || false
    );
  };

  // Filter courses by status
  const activeCourses = courses.filter(
    (course: any) => course.status === "active",
  );
  const inactiveCourses = courses.filter(
    (course: any) => course.status === "inactive",
  );

  // Generate pagination buttons
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
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === i
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  // User Stats Section
  const userStatsData = [
    {
      title: "Enrolled Courses",
      value: userStats.totalEnrolled,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Completed",
      value: userStats.completedCourses,
      icon: Award,
      color: "green",
    },
    {
      title: "Learning Time",
      value: `${Math.floor(userStats.learningTime / 60)}h`,
      icon: Clock,
      color: "purple",
    },
    {
      title: "Day Streak",
      value: userStats.currentStreak,
      icon: Target,
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark",
          className,
        )}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explore Courses
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Discover new skills and continue your learning journey
            </p>
          </div>

          {/* Show inactive courses count */}
          {inactiveCourses.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span>{inactiveCourses.length} course(s) coming soon</span>
            </div>
          )}
        </div>

        {/* User Stats Section */}
        {isUser && userStats.totalEnrolled > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {userStatsData.map((stat, index) => (
              <div
                key={index}
                className={`rounded-lg bg-${stat.color}-50 p-4 dark:bg-${stat.color}-900/20`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full bg-${stat.color}-100 p-2 dark:bg-${stat.color}-800`}
                  >
                    <stat.icon
                      className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Enhanced Search Bar */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search courses by title, description..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex h-4 w-4 flex-col gap-0.5">
              <div className="h-1 rounded-sm bg-current"></div>
              <div className="h-1 rounded-sm bg-current"></div>
              <div className="h-1 rounded-sm bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {search && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Search results for:{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              "{search}"
            </span>
            {activeCourses.length === 0 && " - No active courses found"}
          </div>
          <button
            onClick={clearSearch}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Active Courses Section */}
      {activeCourses.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Available Courses ({activeCourses.length})
          </h3>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled(course)}
                  progress={getCourseProgress(course.id)}
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
                  progress={getCourseProgress(course.id)}
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
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Loader2 className="h-5 w-5 text-orange-500" />
            Coming Soon ({inactiveCourses.length})
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            These courses are being prepared and will be available soon
          </p>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inactiveCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled(course)}
                  progress={getCourseProgress(course.id)}
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
                  progress={getCourseProgress(course.id)}
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

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {activeCourses.length} active courses
            {inactiveCourses.length > 0 &&
              ` and ${inactiveCourses.length} coming soon`}
            {search && ` for "${search}"`}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {generatePaginationButtons()}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

  );
}

// Enhanced Course Card Component for Users
const CourseCard = ({
  course,
  isEnrolled,
  progress,
  onClick,
  onWishlistToggle,
  isInWishlist,
  wishlistLoading,
  formatDate,
  truncateText,
}: any) => {
  const hasChapters = course.has_chapters || course.chapters?.length > 0;
  const isActive = course.status === "active";
  const isInactive = course.status === "inactive";

  // Determine course completeness
  const hasContent = course.has_content;
  const allChaptersHaveLessons = course.all_chapters_have_lessons;
  const allChaptersHaveMCQs = course.all_chapters_have_mcqs;
  const isCourseComplete =
    hasChapters && allChaptersHaveLessons && allChaptersHaveMCQs;

  // Determine course status
  const getCourseStatus = () => {
    if (isInactive) {
      return { status: "inactive", label: "Coming Soon", color: "gray" };
    }

    if (!hasChapters) {
      return { status: "no_chapters", label: "No Content", color: "yellow" };
    }

    if (!isCourseComplete) {
      return {
        status: "under_development",
        label: "Under Development",
        color: "orange",
      };
    }

    return { status: "ready", label: "Ready", color: "green" };
  };

  const courseStatus = getCourseStatus();
  const isCourseAvailable = isActive && isCourseComplete;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isCourseAvailable && !isEnrolled
          ? "cursor-pointer hover:shadow-lg"
          : "cursor-default"
      }`}
      onClick={() => !isEnrolled && isCourseAvailable && onClick()}
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Progress Bar for enrolled users */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {/* Main Status Badge */}
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              courseStatus.color === "gray"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                : courseStatus.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : courseStatus.color === "orange"
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {courseStatus.status === "inactive" && <Lock className="h-3 w-3" />}
            {courseStatus.status === "no_chapters" && (
              <AlertCircle className="h-3 w-3" />
            )}
            {courseStatus.status === "under_development" && (
              <Wrench className="h-3 w-3" />
            )}
            {courseStatus.status === "ready" && (
              <CheckCircle className="h-3 w-3" />
            )}
            {courseStatus.label}
          </span>

          {/* Enrolled Badge */}
          {isEnrolled && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Enrolled
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute right-3 top-3 rounded-full p-2 shadow-md transition-all duration-200 ${
            isInWishlist
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
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

        {/* Overlay for inactive courses */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-center text-white">
              <Lock className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm font-medium">Coming Soon</p>
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute right-3 top-12">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              course.price_type === "free"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {course.price_type === "free" ? "FREE" : `$${course.price}`}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Category and Rating */}
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Tag className="mr-1 h-3 w-3" />
            {course.category || "Uncategorized"}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{course.ratings || "0.0"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
          {truncateText(course.description || "No description available", 100)}
        </p>

        {/* Maintenance Message for active courses with incomplete content */}
        {isActive && !isCourseComplete && (
          <CourseMaintenanceMessage course={course} className="mb-4" />
        )}

        {/* Meta Information */}
        <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{course.creator}</span>
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

        {/* Course Stats - Only show if course has chapters */}
        {hasChapters && (
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{course.totalChapters || 0} chapters</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <FileQuestion className="h-3 w-3" />
              <span>{course.totalMCQs || 0} MCQs</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.enrollment_count || 0} enrolled</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {isEnrolled ? (
            // Already Enrolled Button
            <div className="flex w-full items-center justify-between">
              <button
                onClick={onClick}
                className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                <CheckCircle className="h-4 w-4" />
                Already Enrolled
              </button>
              <button
                onClick={onClick}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                Continue
              </button>
            </div>
          ) : (
            // Regular View Details Button for non-enrolled users
            <button
              onClick={onClick}
              disabled={!isCourseAvailable}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isCourseAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
              }`}
            >
              {isInactive ? (
                <>
                  <Lock className="h-4 w-4" />
                  Coming Soon
                </>
              ) : !hasChapters ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  No Content
                </>
              ) : !isCourseComplete ? (
                <>
                  <Wrench className="h-4 w-4" />
                  Under Development
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View Details
                </>
              )}
            </button>
          )}

          {/* Progress for enrolled users */}
          {isEnrolled && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {progress}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Complete
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseListItem = ({
  course,
  isEnrolled,
  progress,
  onClick,
  onWishlistToggle,
  isInWishlist,
  wishlistLoading,
  formatDate,
  truncateText,
}: any) => {
  const hasChapters = course.has_chapters || course.chapters?.length > 0;
  const isActive = course.status === "active";
  const isInactive = course.status === "inactive";

  return (
    <div
      className={`group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isActive && hasChapters && !isEnrolled
          ? "cursor-pointer hover:shadow-lg"
          : "cursor-default"
      }`}
      onClick={() => !isEnrolled && onClick()}
    >
      {/* Course Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute right-2 top-2 rounded-full p-1.5 shadow-md transition-all duration-200 ${
            isInWishlist
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlistLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart
              className={`h-3 w-3 ${isInWishlist ? "fill-current" : ""}`}
            />
          )}
        </button>

        {/* Overlay for inactive courses */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Lock className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {course.category || "Uncategorized"}
              </span>
              {isInactive && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <Loader2 className="h-3 w-3" />
                  Coming Soon
                </span>
              )}
              {isEnrolled && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Enrolled
                </span>
              )}
              {isActive && !hasChapters && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <AlertCircle className="h-3 w-3" />
                  Preparing
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  course.price_type === "free"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {course.price_type === "free" ? "FREE" : `$${course.price}`}
              </span>
            </div>

            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {course.title}
            </h3>

            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              {truncateText(
                course.description || "No description available",
                150,
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{course.creator}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.ratings || "0.0"}</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>

            {/* Enrollment Info */}
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrollment_count || 0} enrolled</span>
              </div>
              {isEnrolled && course.enrolled_at && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  You enrolled on {formatDate(course.enrolled_at)}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-end gap-2">
            {isEnrolled ? (
              <>
                <button
                  onClick={onClick}
                  className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                >
                  <CheckCircle className="h-4 w-4" />
                  Already Enrolled
                </button>
                <button
                  onClick={onClick}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Play className="h-4 w-4" />
                  Continue Learning
                </button>
              </>
            ) : (
              <button
                onClick={onClick}
                disabled={!isActive || !hasChapters}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive && hasChapters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                }`}
              >
                {isInactive ? (
                  <>
                    <Loader2 className="h-4 w-4" />
                    Coming Soon
                  </>
                ) : !hasChapters ? (
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
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ search }: any) => (
  <div className="col-span-full py-12 text-center">
    <div className="mx-auto max-w-md">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {search ? "No courses found" : "No courses available"}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {search
          ? "Try adjusting your search terms or filters"
          : "Check back later for new courses"}
      </p>
    </div>
  </div>
);
