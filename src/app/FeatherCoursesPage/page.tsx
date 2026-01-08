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
  Eye,
  Users,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle,
  FileQuestion,
  Heart,
  TrendingUp,
  Zap,
   Wifi, WifiOff 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDecryptedItem, truncateText } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import { useDebounce } from "@/utils/debounce";
import { useWishlist } from "@/hooks/useWishlist";
export default function UserCourseDashboard({ className }: any) {
  const router = useRouter();
    const [OldCourses, setOldCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [courses, setCourses] = useState<any[]>([]);
  const [role, setRole] = useState<any>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
 
  const api = useApiClient();
  const loggedInuserId: any = getDecryptedItem("userId");
  // Use the wishlist hook
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

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

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        category: categoryFilter,
        sort: sortBy,
      });

      const res = await api.get(
        `enroll/user/${loggedInuserId}/courses?${query.toString()}`
      );

      if (res.success) {
        const enrolled = res.data?.enrolledCourses || [];
        setCourses(enrolled);

        if (res.success) {
          const unenrolled = res.data?.unenrolledCourses || [];

          const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
          const now = Date.now();

          const oldCourses = unenrolled;
          const sortedOldCourses = [...oldCourses].sort((a: any, b: any) => {
            // Primary: average rating
            const ratingDiff = (b.average_rating || 0) - (a.average_rating || 0);
            if (ratingDiff !== 0) return ratingDiff;

            // Secondary: rating count (more reviews first)
            return (b.rating_count || 0) - (a.rating_count || 0);
          });


          setOldCourses(sortedOldCourses);
        }

      }
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
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

  
  
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-6 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Filters and Controls */}

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
                  </h3>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {OldCourses.map((course: any) => (
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

          
          </>
        )}
      </div>
    </div>
  );
}


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
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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

          {/* Course Mode Badge */}
          {course.mode && (
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                course.mode === "online"
                  ? "bg-blue-500/90 text-white"
                  : "bg-purple-500/90 text-white"
              }`}
            >
              {course.mode === "online" ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Online Course
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Offline Course
                </>
              )}
            </span>
          )}

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
      className={`group flex items-start gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${isActive && isCourseComplete && !isEnrolled
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
          className={`absolute right-2 top-2 rounded-full p-1.5 backdrop-blur-sm transition-all duration-300 ${isInWishlist
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
                className={`rounded-full px-3 py-1 text-xs font-medium ${course.price_type === "free"
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
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${isActive && isCourseComplete
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