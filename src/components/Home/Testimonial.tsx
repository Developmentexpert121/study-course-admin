// components/Testimonial.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Rating {
  id: number;
  score: number;
  review: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  user: {
    id: number;
    username: string;
    profileImage: string | null;
  };
  course: {
    id: number;
    title: string;
    image: string;
    description: string;
    price: string;
    creator: {
      id: number;
      username: string;
      profileImage: string | null;
    };
  };
}

interface TestimonialProps {
  ratings: Rating[] | any;
}

const Testimonial: React.FC<TestimonialProps> = ({ ratings }) => {
  const getRatingsArray = (): Rating[] => {
    if (Array.isArray(ratings)) return ratings;
    if (
      ratings &&
      typeof ratings === "object" &&
      Array.isArray(ratings.ratings)
    ) {
      return ratings.ratings;
    }
    if (
      ratings &&
      typeof ratings === "object" &&
      Array.isArray(ratings.data?.ratings)
    ) {
      return ratings.data.ratings;
    }
    return [];
  };

  const ratingsArray = getRatingsArray();

  const hasReview = (rating: Rating) => {
    return rating.review && rating.review.trim() !== "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const visibleRatings = ratingsArray;

  if (visibleRatings.length === 0) {
    return (
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              TESTIMONIALS
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Loved by Our Students
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Join thousands of satisfied learners who have transformed their
              careers
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            TESTIMONIALS
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Loved by Our Students
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join thousands of satisfied learners who have transformed their
            careers with our courses
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleRatings.map((rating: any) => (
            <div
              key={rating.id}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Header with user info and rating */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                    {rating.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {rating.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                </div>

                {/* Rating badge */}
                <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1">
                  <span className="text-lg text-yellow-400">★</span>
                  <span className="text-sm font-semibold text-green-700">
                    {rating.score}.0
                  </span>
                </div>
              </div>

              {/* Course info */}
              <div className="mb-4">
                <p className="line-clamp-1 text-sm font-medium text-gray-900">
                  {rating.course?.title}
                </p>
                <p className="text-xs text-gray-500">
                  By {rating.course?.creator?.username}
                </p>
              </div>

              {/* Review content */}
              {hasReview(rating) ? (
                <div className="mb-6">
                  <p className="line-clamp-4 text-sm leading-relaxed text-gray-700 transition-all group-hover:line-clamp-none">
                    "{rating.review}"
                  </p>
                </div>
              ) : (
                <div className="mb-6 py-4 text-center">
                  <div className="mb-3 flex justify-center">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-2xl ${
                          index < rating.score
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Rated this course {rating.score} out of 5
                  </p>
                </div>
              )}

              {/* Footer with date and verification */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-500">
                  {rating.createdAt || rating.created_at
                    ? formatDate(rating.createdAt || rating.created_at)
                    : "Recently"}
                </span>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute right-0 top-0 h-8 w-8 overflow-hidden">
                <div className="absolute right-0 top-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rotate-45 transform bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics with modern design */}
        {ratings?.statistics && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  {ratings.statistics.total_ratings}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Ratings
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center text-3xl font-bold text-gray-900">
                  {ratings.statistics.average_rating}
                  <span className="ml-1 text-xl text-yellow-400">★</span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  {ratings.statistics.total_reviews}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Written Reviews
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  {Math.round(
                    (ratings.statistics.rating_distribution[5] /
                      ratings.statistics.total_ratings) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm font-medium text-gray-600">
                  5 Star Ratings
                </div>
              </div>
            </div>

            {/* Rating distribution bar */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                Rating Distribution
              </h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex w-12 items-center gap-1">
                      <span className="text-sm font-medium text-gray-600">
                        {stars}
                      </span>
                      <span className="text-yellow-400">★</span>
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                        style={{
                          width: `${(ratings.statistics.rating_distribution[stars] / ratings.statistics.total_ratings) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-sm text-gray-600">
                      {ratings.statistics.rating_distribution[stars]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h3 className="mb-3 text-2xl font-bold">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="mx-auto mb-6 max-w-md text-blue-100">
              Join our community of learners and transform your career with
              industry-relevant courses
            </p>
            <button className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-colors duration-200 hover:bg-gray-100">
              Explore All Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
