// components/Testimonial.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  // Calculate slides per view based on screen size
 const getSlidesPerView = () => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || visibleRatings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev >= visibleRatings.length - slidesPerView ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, visibleRatings.length, slidesPerView]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev >= visibleRatings.length - slidesPerView ? 0 : prev + 1,
    );
  }, [visibleRatings.length, slidesPerView]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? visibleRatings.length - slidesPerView : prev - 1,
    );
  }, [visibleRatings.length, slidesPerView]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (visibleRatings.length === 0) {
    return (
      <></>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            TESTIMONIALS
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Loved by <span className= "bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent">Our Students</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join thousands of satisfied learners who have transformed their
            careers with our courses
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute  top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            aria-label="Previous testimonials"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            aria-label="Next testimonials"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                // width: `${(visibleRatings.length / slidesPerView) * 100}%`,
              }}
            >
              {visibleRatings.map((rating: any) => (
                <div
                  key={rating.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="group relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Header with user info and rating */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                          {rating.user?.username?.charAt(0).toUpperCase() ||
                            "U"}
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({
              length: Math.max(1, visibleRatings.length - slidesPerView + 1),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-gradient-to-br from-primary to-[#ec4899] "
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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

     
      </div>
    </section>
  );
};

export default Testimonial;
