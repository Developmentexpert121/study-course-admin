// components/Testimonial.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

interface Rating {
  id: number;
  user_id: number;
  score: number;
  review: string;
  status: string;
  created_at?: string;
  user: {
    username: string;
  };
  course: {
    title: string;
  };
}

interface TestimonialProps {
  ratings: Rating[];
}

const Testimonial: React.FC<TestimonialProps> = ({ ratings }) => {
  // Render star rating
  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < score ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const visibleRatings = ratings.filter(
    (rating) => rating.status === "showtoeveryone",
  );

  if (visibleRatings.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            Our <span className="font-extrabold text-[#02517b]">Satisfied</span>{" "}
            Clients
          </h2>
        </div>

        {/* Display Ratings if available */}
        {ratings && ratings.length > 0 ? (
          <div className="mb-12">
            <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
              Course Ratings & Reviews
            </h3>
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {visibleRatings.map((rating, index) => (
                <SwiperSlide key={rating.id || index}>
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-6 shadow-md transition hover:shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#02517b] font-bold text-white">
                          {rating.user_id}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {rating.user.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {rating.course.title}
                          </p>
                        </div>
                      </div>
                      {renderStars(rating.score)}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm italic text-gray-600">
                        {rating.review || "Great course! Highly recommended."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                        {rating.status}
                      </span>
                      <span>
                        {rating.created_at
                          ? new Date(rating.created_at).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="mb-12 text-center">
            <p className="text-gray-500">Loading ratings...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
