"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  User,
  Mail,
  Calendar,
  BookOpen,
  RefreshCw,
  Eye,
  Info,
  EyeOff,
  Check,
  X,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";

interface Rating {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  review: string;
  status: "showtoeveryone" | "hidebyadmin" | "hidebysuperadmin";
  isactive: boolean;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
  };
  course: {
    id: number;
    title: string;
  };
}

export default function RatingsManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useApiClient();

  const courseId = searchParams.get("course_id");
  const courseTitle = searchParams.get("course_title");

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Stats
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    visibleRatings: 0,
    hiddenRatings: 0,
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  // In your RatingsManagementPage component
  const fetchRatings = async () => {
    try {
      setLoading(true);

      // Use the new API endpoint for course-specific ratings
      let url = "rating";

      if (courseId) {
        url = `rating/course/${courseId}`;
      }

      const res = await api.get(url);

      if (res.success) {
        console.log("res.sssss",res?.data?.data)
        // The new API returns both ratings and statistics
        const ratingsData = res.data?.data || [];
        const statistics = res.data?.data?.statistics || {};

        setRatings(ratingsData);
        setStats({
          totalRatings: statistics.total_ratings || 0,
          averageRating: statistics.average_rating || 0,
          visibleRatings: statistics.visible_ratings || 0,
          hiddenRatings: statistics.hidden_ratings || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
      toasterError("Failed to fetch ratings", 2000, "id");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRatings();
  }, [courseId]);

  // Filter ratings based on filters and get latest five
  const filteredRatings = ratings
    .filter((rating) => {
      const statusMatch =
        statusFilter === "all" || rating.status === statusFilter;
      const scoreMatch =
        scoreFilter === "all" || rating.score.toString() === scoreFilter;
      return statusMatch && scoreMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by latest first
    .slice(0, 5); // Get only the latest five ratings

  // Handle hide review (only hides the review text, keeps rating visible)
  const handleHideReview = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.patch(`rating/${ratingId}/hide-review`);

      if (res.success) {
        toasterSuccess("Review hidden successfully", 2000, "id");
        fetchRatings(); // Refresh the list
      } else {
        toasterError(res.error?.message || "Failed to hide review", 2000, "id");
      }
    } catch (error) {
      console.error("Failed to hide review:", error);
      toasterError("Failed to hide review. Please try again.", 2000, "id");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle unhide review
  const handleUnhideReview = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.patch(`rating/${ratingId}/unhide-review`);

      if (res.success) {
        toasterSuccess("Review shown successfully", 2000, "id");
        fetchRatings(); // Refresh the list
      } else {
        toasterError(res.error?.message || "Failed to show review", 2000, "id");
      }
    } catch (error) {
      console.error("Failed to unhide review:", error);
      toasterError("Failed to show review. Please try again.", 2000, "id");
    } finally {
      setActionLoading(null);
    }
  };

  // Keep your existing functions for hiding/unhiding entire ratings if needed
  const handleHideRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.patch(`rating/${ratingId}/hide`);

      if (res.success) {
        toasterSuccess("Rating hidden successfully", 2000, "id");
        fetchRatings();
      } else {
        toasterError(res.error?.message || "Failed to hide rating", 2000, "id");
      }
    } catch (error) {
      console.error("Failed to hide rating:", error);
      toasterError("Failed to hide rating. Please try again.", 2000, "id");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnhideRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.patch(`rating/${ratingId}/unhide`);

      if (res.success) {
        toasterSuccess("Rating shown successfully", 2000, "id");
        fetchRatings();
      } else {
        toasterError(res.error?.message || "Failed to show rating", 2000, "id");
      }
    } catch (error) {
      console.error("Failed to unhide rating:", error);
      toasterError("Failed to show rating. Please try again.", 2000, "id");
    } finally {
      setActionLoading(null);
    }
  };
  // Handle soft delete (deactivate)
  const handleDeleteRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.delete(`rating/${ratingId}`);

      if (res.success) {
        toasterSuccess("Rating Delete successfully", 2000, "id");
        fetchRatings();
      } else {
        toasterError(
          res.error?.message || "Failed to deactivate rating",
          2000,
          "id",
        );
      }
    } catch (error) {
      console.error("Failed to deactivate rating:", error);
      toasterError("Failed to deactivate rating. Please try again.", 200, "id");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle activate rating
  const handleAddRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      const res = await api.patch(`ratings/${ratingId}/add`);

      if (res.success) {
        toasterSuccess("Rating activated successfully", 2000, "id");
        fetchRatings();
      } else {
        toasterError(
          res.error?.message || "Failed to activate rating",
          2000,
          "id",
        );
      }
    } catch (error) {
      console.error("Failed to activate rating:", error);
      toasterError("Failed to activate rating. Please try again.", 2000, "id");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter("all");
    setScoreFilter("all");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto ">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Review
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {filteredRatings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Star className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="font-medium text-gray-500 dark:text-white">
                        No ratings found
                      </p>
                      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        {ratings.length === 0
                          ? "No ratings available yet"
                          : "No ratings match your filters"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRatings.map((rating : any , index : number) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {rating.user?.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                src={rating.rating_user.profileImage}
                                alt={rating.user.username}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 dark:border-blue-400">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {rating.rating_user?.username || "Unknown User"}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">
                                {rating.rating_user?.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">

                        <div className="mt-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.score
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                            {rating.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 dark:text-gray-300">
                            {rating.review ? (
                              <span className="line-clamp-2">
                                {rating.review}
                              </span>
                            ) : (
                              <span className="italic text-gray-500 dark:text-gray-400">
                                No review
                              </span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          switch (rating.status) {
                            case "showtoeveryone":
                              return (
                                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                                  <Eye className="mr-1.5 h-4 w-4" />
                                  Visible
                                </span>
                              );
                            case "hidebyadmin":
                              return (
                                <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400">
                                  <EyeOff className="mr-1.5 h-4 w-4" />
                                  Hidden by Admin
                                </span>
                              );
                            case "hidebysuperadmin":
                              return (
                                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                                  <EyeOff className="mr-1.5 h-4 w-4" />
                                  Hidden by Super Admin
                                </span>
                              );
                            default:
                              return (
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400">
                                  <Info className="mr-1.5 h-4 w-4" />
                                  Unknown
                                </span>
                              );
                          }
                        })()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(rating.createdAt)}</span>
                        </div>
                      </td>
                      <td className="flex h-full items-center gap-2 whitespace-nowrap px-6 py-4">
                        {/* Review Visibility Controls */}
                        {rating.review &&
                        rating.review_visibility === "visible" ? (
                          <button
                            onClick={() => handleHideReview(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <EyeOff className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id
                              ? "Hiding..."
                              : "Hide Review"}
                          </button>
                        ) : rating.review &&
                          rating.review_visibility !== "visible" ? (
                          <button
                            onClick={() => handleUnhideReview(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id
                              ? "Showing..."
                              : "Show Review"}
                          </button>
                        ) : null}

                        {/* Rating Visibility Controls */}
                        {rating.status === "showtoeveryone" ? (
                          <button
                            onClick={() => handleHideRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <EyeOff className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id
                              ? "Hiding..."
                              : "Hide Rating"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnhideRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id
                              ? "Showing..."
                              : "Show Rating"}
                          </button>
                        )}

                        {/* Active/Inactive Controls */}
                        {rating.isactive ? (
                          <button
                            onClick={() => handleDeleteRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === rating.id ? (
                              <div className="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-white"></div>
                            ) : (
                              <X className="mr-1 h-3.5 w-3.5" />
                            )}
                            {actionLoading === rating.id
                              ? "Deactivating..."
                              : "Deactivate"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === rating.id ? (
                              <div className="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-white"></div>
                            ) : (
                              <Check className="mr-1 h-3.5 w-3.5" />
                            )}
                            {actionLoading === rating.id
                              ? "Activating..."
                              : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing latest {filteredRatings.length} of {ratings.length} total ratings
          </p>
        </div>
      </div>
    </div>
  );
}