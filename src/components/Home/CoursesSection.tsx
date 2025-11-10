// components/Home/CoursesSection.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";

// Use the same interface as your Redux slice
interface Course {
  id: number; // Changed from string to number
  title: string;
  image: string;
}

interface CoursesSectionProps {
  courses: Course[];
}

const CoursesSection: React.FC<any> = ({ courses }) => {
  const router = useRouter();

  if (courses.length === 0) return null;

  return (
    <section id="courses" className="my-20 px-6 md:px-20">
      <div className="container">
        <h2 className="trending-text mb-2 text-center text-3xl font-extrabold md:text-4xl">
          Explore My Courses
        </h2>
        <p className="mb-10 text-center">
          DevexHub empowers you to build in-demand skills quickly and take
          <br />
          your career to the next level in today's evolving job market.
        </p>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {courses.map((course: any, index: any) => (
            <SwiperSlide key={course.id || index}>
              <div className="rounded-xl bg-white shadow-lg transition hover:scale-105 hover:shadow-2xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full rounded-t-xl object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  <button
                    onClick={() => router.push(`/auth/courses/${course.id}`)}
                    className="relative mt-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#012d48] via-[#02517b] to-[#0388c7] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(2,81,123,0.6)]"
                  >
                    <span className="relative z-10">View Now</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#0388c7] to-[#02517b] opacity-0 transition-opacity duration-500 hover:opacity-100"></span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CoursesSection;
