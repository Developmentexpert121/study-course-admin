// components/course-learn/ReviewsTab.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import { Star, Send, Edit3, Trash2, User, X } from "lucide-react";
import { getDecryptedItem } from "@/utils/storageHelper";

interface Review {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  review: string | null;
  status: string;
  isactive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    profileImage: string | null;
  };
}

interface ReviewsTabProps {
  course: any;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ course }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    score: 0,
    review: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const api = useApiClient();
  const currentUserId: any = getDecryptedItem("userId");
console.log("this is the review of user", reviews)
  useEffect(() => {
    if (course?.id) {
      fetchReviews();
    }
  }, [course?.id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `rating/course/${course.id}/details${currentUserId ? `?user_id=${currentUserId}` : ""}`,
      );

      if (response.success) {
        const reviewsData = response.data.data.all_ratings || [];
        setReviews(reviewsData);

        // If user has a review, pre-fill the form for editing
        const userReview = response.data.data.user_rating;
        if (userReview) {
          setFormData({
            score: userReview.score,
            review: userReview.review || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      await fetchAllRatingsFallback();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRatingsFallback = async () => {
    try {
      const response = await api.get("rating");
      if (response.success) {
        const courseReviews = response.data.data.filter(
          (review: Review) =>
            review.course_id === course?.id &&
            review.isactive &&
            review.status === "showtoeveryone",
        );
        setReviews(courseReviews);
      }
    } catch (error) {
      console.error("Error with fallback:", error);
    }
  };

  // Check if user has already reviewed
  const userHasReviewed = reviews.some(
    (review) => review.user_id === parseInt(currentUserId),
  );

  // Get user's existing review
  const userReview = reviews.find(
    (review) => review.user_id === parseInt(currentUserId),
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.score === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const user: any = getDecryptedItem("userId");

      if (userHasReviewed && userReview) {
        // Update existing review
        const response = await api.patch(`rating/${userReview.id}`, {
          score: formData.score,
          review: formData.review,
        });

        if (response.success) {
          setReviews((prev) =>
            prev.map((review) =>
              review.id === userReview.id ? response.data.data : review,
            ),
          );
          setEditingReview(null);
          setShowReviewForm(false);
          alert("Review updated successfully!");
          fetchReviews(); // Refresh to get updated data
        }
      } else {
        // Create new review
        const response = await api.post("rating", {
          user_id: parseInt(user),
          course_id: course.id,
          score: formData.score,
          review: formData.review,
        });

        if (response.success) {
          await fetchReviews();
          setFormData({ score: 0, review: "" });
          setShowReviewForm(false);
          alert("Review submitted successfully!");
        }
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 409) {
        alert(
          "You have already reviewed this course. Please edit your existing review.",
        );
        // Auto-populate the form with existing review
        if (userReview) {
          setFormData({
            score: userReview.score,
            review: userReview.review || "",
          });
          setShowReviewForm(true);
        }
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to submit review. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    if (userReview) {
      setFormData({
        score: userReview.score,
        review: userReview.review || "",
      });
      setShowReviewForm(true);
      setEditingReview(userReview);
    }
  };

  const handleCancelEdit = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    if (userReview) {
      // Reset form to user's current review
      setFormData({
        score: userReview.score,
        review: userReview.review || "",
      });
    } else {
      // Reset form to empty
      setFormData({ score: 0, review: "" });
    }
  };

  const handleDeleteReview = async (rating_id: number) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const response = await api.delete(`rating/user/${rating_id}/delete`);

      if (response.success) {
        setReviews((prev) => prev.filter((review) => review.id !== rating_id));
        setFormData({ score: 0, review: "" });
        setShowReviewForm(false);
        setEditingReview(null);
        alert("Review deleted successfully!");
        fetchReviews(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting review:", error);
    
    }
  };

  const handleAddReviewClick = () => {
    setShowReviewForm(true);
    setFormData({ score: 0, review: "" });
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
      : 0;

  // Star rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.score === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((review) => review.score === stars).length /
            reviews.length) *
          100
        : 0,
  }));

  const StarRating = ({
    rating,
    onRatingChange,
    interactive = false,
    size = "md",
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`${
              interactive
                ? "cursor-pointer transition-transform hover:scale-110"
                : "cursor-default"
            }`}
            disabled={!interactive || submitting}
          >
            <Star
              className={`${sizes[size]} ${
                star <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="mt-2">
              <StarRating rating={averageRating} size="lg" />
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>

            {/* Add Review Button for logged-in users who haven't reviewed */}
            {currentUserId && !userHasReviewed && !showReviewForm && (
              <button
                onClick={handleAddReviewClick}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Add Your Review
              </button>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Rating Distribution
              </h3>
              {currentUserId && userHasReviewed && !showReviewForm && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit Review
                  </button>
                  <button
                    onClick={() =>
                      userReview && handleDeleteReview(userReview.id)
                    }
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex w-16 items-center gap-1">
                    <span className="w-4 text-sm text-gray-600 dark:text-gray-400">
                      {stars}
                    </span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right text-sm text-gray-600 dark:text-gray-400">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form - Only shown when user wants to add/edit */}
      {currentUserId && showReviewForm && (
        <div
          id="review-form"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userHasReviewed ? "Edit Your Review" : "Write a Review"}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Rating *
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={formData.score}
                  onRatingChange={(rating) =>
                    setFormData((prev) => ({ ...prev, score: rating }))
                  }
                  interactive
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {formData.score > 0 &&
                    `${formData.score} star${formData.score !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="review"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Review {userHasReviewed ? "" : "(Optional)"}
              </label>
              <textarea
                id="review"
                rows={4}
                value={formData.review}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, review: e.target.value }))
                }
                placeholder="Share your experience with this course..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                disabled={submitting}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || formData.score === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {userHasReviewed ? "Update Review" : "Submit Review"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Current Review Preview (when not editing) */}
      {currentUserId && userHasReviewed && !showReviewForm && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Your Review
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => userReview && handleDeleteReview(userReview.id)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
          <div className="mt-3">
            <StarRating rating={userReview?.score || 0} />
            {userReview?.review && (
              <p className="mt-2 text-blue-800 dark:text-blue-200">
                {userReview.review}
              </p>
            )}
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              Posted on{" "}
              {userReview
                ? new Date(userReview.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Student Reviews (
          {reviews.filter((r) => r.user_id !== parseInt(currentUserId)).length})
        </h3>

        {reviews.filter((r) => r.user_id !== parseInt(currentUserId)).length ===
        0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <Star className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {reviews.length === 0
                  ? "No reviews yet"
                  : "No other reviews yet"}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUserId && !userHasReviewed && !showReviewForm
                  ? "Be the first to share your experience!"
                  : "Other students haven't reviewed this course yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews
              .filter((review) => review.user_id !== parseInt(currentUserId))
              .map((review: any) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      {review.user?.profileImage ? (
                        <img
                          src={review.user.profileImage}
                          alt={review.user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}

                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {review?.rating_user?.username || "Anonymous User"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                          {review.updatedAt !== review.createdAt && (
                            <span className="ml-2 text-xs text-gray-500">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-3">
                    <StarRating rating={review.score} />
                  </div>

                  {/* Review Text */}
                  {review.review && (
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {review.review}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Login Prompt */}
      {!currentUserId && (
        <div className="rounded-2xl border border-gray-200 bg-yellow-50 p-6 text-center dark:border-gray-700 dark:bg-yellow-900/20">
          <h4 className="mb-2 text-lg font-medium text-yellow-800 dark:text-yellow-200">
            Want to share your experience?
          </h4>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please login to rate and review this course.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
