// components/Home/CoursesSection.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import { FaStar, FaUsers } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

// Use the same interface as your Redux slice
interface Course {
  id: number; // Changed from string to number
  title: string;
  image: string;
}

const CoursesSection: React.FC<any> = ({ courses }) => {
  const router = useRouter();

  if (courses.length === 0) return null;

  return (
    // <section id="courses" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
    //   <div className="max-w-7xl mx-auto px-6ss">
    //     <h2 className="trending-text mb-2 text-center text-3xl font-extrabold md:text-4xl">
    //       Explore My Courses
    //     </h2>
    //     <p className="mb-10 text-center">
    //       DevexHub empowers you to build in-demand skills quickly and take
    //       <br />
    //       your career to the next level in today's evolving job market.
    //     </p>

    //     <Swiper
    //       modules={[Navigation, Pagination]}
    //       spaceBetween={20}
    //       slidesPerView={1}
    //       navigation
    //       pagination={{ clickable: true }}
    //       breakpoints={{
    //         640: { slidesPerView: 1 },
    //         768: { slidesPerView: 2 },
    //         1024: { slidesPerView: 3 },
    //       }}
    //     >
    //       {courses.map((course: any, index: any) => (
    //         <SwiperSlide key={course.id || index}>
    //           <div className="rounded-xl bg-white shadow-lg transition hover:scale-105 hover:shadow-2xl">
    //             <img
    //               src={course.image}
    //               alt={course.title}
    //               className="h-48 w-full rounded-t-xl object-cover"
    //             />
    //             <div className="p-4">
    //               <h3 className="mb-2 text-lg font-semibold text-gray-800">
    //                 {course.title}
    //               </h3>
    //               <button
    //                 onClick={() => router.push(`/auth/courses/${course.id}`)}
    //                 className="relative mt-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#012d48] via-[#02517b] to-[#0388c7] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(2,81,123,0.6)]"
    //               >
    //                 <span className="relative z-10">View Now</span>
    //                 <span className="absolute inset-0 bg-gradient-to-r from-[#0388c7] to-[#02517b] opacity-0 transition-opacity duration-500 hover:opacity-100"></span>
    //               </button>
    //             </div>
    //           </div>
    //         </SwiperSlide>
    //       ))}
    //     </Swiper>
    //   </div>
    // </section>
    <section id="courses" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl text-center">
          Explore 
          <span className="bg-gradient-to-r from-primary to-[#ec4899] bg-clip-text text-transparent"> Courses</span> 
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 text-center">
          DevexHub empowers you to build in-demand skills quickly and take
          <br />
          your career to the next level in today's evolving job market.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any, index: any) => (
            <div
              key={course.id || index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:drop-shadow-lg"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full rounded-t-xl object-cover"
              />

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    Design
                  </span>


                  <div className="flex items-center text-yellow-500">
                    <FaStar className="text-sm" />
                    <span className="ml-1 text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#2ec2b333] flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary">KS</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium capitalize">Karanveer singh</span>
                    </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  Master modern design principles and create stunning user experiences
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      12 weeks
                    </span>

                    <span className="flex items-center">
                      <FaUsers className="mr-1" />
                      250+
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/auth/courses/${course.id}`)}
                    className="font-semibold text-primary hover:text-[#0388c7] transition-colors"
                  >
                    View →
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default CoursesSection;
