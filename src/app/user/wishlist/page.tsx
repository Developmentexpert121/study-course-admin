// app/user/wishlist/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import {
  Heart,
  Trash2,
  Clock,
  Users,
  Star,
  Loader2,
  BookOpen,
  Play,
  Eye,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Tag,
  User,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, fetchWishlist } =
    useWishlist();
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "title" | "rating">("newest");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (courseId: number) => {
    setRemovingCourseId(courseId);
    try {
      await removeFromWishlist(courseId);
    } finally {
      setRemovingCourseId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sort wishlist items
  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "title":
        return a.course.title.localeCompare(b.course.title);
      case "rating":
        const ratingA =
          a.course.ratings?.average_rating || a.course.average_rating || 0;
        const ratingB =
          b.course.ratings?.average_rating || b.course.average_rating || 0;
        return ratingB - ratingA;
      default:
        return 0;
    }
  });

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 dark:from-gray-900 dark:to-blue-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <Heart className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  Loading Your Wishlist
                </div>
                <div className="mt-2 text-gray-600 dark:text-gray-400">
                  Gathering your saved courses...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 dark:from-gray-900 dark:to-blue-900/20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-lg dark:border-red-800 dark:bg-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-red-800 dark:text-red-300">
                Unable to Load Wishlist
              </h3>
              <p className="mb-6 max-w-md text-red-700 dark:text-red-400">
                {error}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchWishlist()}
                  className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
                >
                  Try Again
                </button>
                <Link
                  href="/user/courses"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 dark:from-gray-900 dark:to-blue-900/20">
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 p-3 shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    My Wishlist
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    {wishlist.length}{" "}
                    {wishlist.length === 1
                      ? "precious course"
                      : "amazing courses"}{" "}
                    saved for later
                  </p>
                </div>
              </div>
            </div>

            {wishlist.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="title">Sort by: Title</option>
                  <option value="rating">Sort by: Rating</option>
                </select>

                <Link
                  href="/user/courses"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <BookOpen className="h-5 w-5" />
                  Explore More Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-br from-pink-100 to-red-100 p-8 dark:from-pink-900/20 dark:to-red-900/20">
                    <Heart size={80} className="text-pink-500" />
                  </div>
                  <div className="absolute -right-2 -top-2 rounded-full bg-yellow-500 p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Your Wishlist is Waiting to be Filled!
              </h3>
              <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                Discover amazing courses and save them here to build your
                learning journey. Your future skills are just a click away!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/user/courses"
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <BookOpen className="h-6 w-6" />
                  Start Exploring Courses
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/user/courses?filter=popular"
                  className="inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <Star className="h-6 w-6 text-yellow-500" />
                  View Popular Courses
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {wishlist.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Courses
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    wishlist.filter((item) => item.course.status === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Available Now
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    wishlist.filter((item) => item.course.price_type === "free")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Free Courses
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(wishlist.map((item) => item.course.category)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Categories
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedWishlist.map((item: WishlistItem) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800"
                >
                  {/* Course Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {item.course.image ? (
                      <Image
                        src={item.course.image}
                        alt={item.course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Action Buttons */}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        onClick={() => handleRemoveFromWishlist(item.course.id)}
                        disabled={removingCourseId === item.course.id}
                        className="rounded-full bg-white/90 p-2.5 shadow-lg transition-all hover:scale-110 hover:bg-white hover:text-red-500 disabled:opacity-50 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                        title="Remove from wishlist"
                      >
                        {removingCourseId === item.course.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Status Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.course.status === "active"
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-orange-500 text-white shadow-lg"
                        }`}
                      >
                        {item.course.status === "active" ? (
                          <>
                            <Play className="h-3 w-3" />
                            Available
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Coming Soon
                          </>
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.course.price_type === "free"
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-blue-500 text-white shadow-lg"
                        }`}
                      >
                        {item.course.price_type === "free"
                          ? "FREE"
                          : `$${item.course.price}`}
                      </span>
                    </div>

                    {/* Hover Action */}
                    <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {item.course.status === "active" &&
                      item.course.has_chapters ? (
                        <Link
                          href={`/user/courses/CourseEnrollment/${item.course.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                          View Course
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          <AlertCircle className="h-4 w-4" />
                          {!item.course.has_chapters
                            ? "Content Preparing"
                            : "Coming Soon"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Tag className="h-3 w-3" />
                        {item.course.category || "Uncategorized"}
                      </span>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-900 dark:text-white">
                          {item.course.ratings?.average_rating?.toFixed(1) ||
                            item.course.average_rating?.toFixed(1) ||
                            "0.0"}
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      {item.course.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.course.description || "No description available"}
                    </p>

                    {/* Course Meta */}
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          By {item.course.creator_name || item.course.creator}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Added {formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Course Stats */}
                    {item.course.has_chapters && (
                      <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                            <BookOpen className="h-3 w-3" />
                            {item.course.totalChapters || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Chapters
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                            <Play className="h-3 w-3" />
                            {item.course.totalLessons || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Lessons
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                            <Users className="h-3 w-3" />
                            {item.course.enrollment_count || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Enrolled
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Info */}
                    {item.course.course_readiness && (
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span>Course Completion</span>
                          <span>
                            {item.course.course_readiness
                              .completion_percentage || 0}
                            %
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all duration-300"
                            style={{
                              width: `${item.course.course_readiness.completion_percentage || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
