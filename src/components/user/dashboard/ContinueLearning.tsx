// components/dashboard/ContinueLearning.tsx
"use client";

import Link from "next/link";
import { Play, Clock, BookOpen } from "lucide-react";

const continueLearningCourses = [
  {
    id: 1,
    title: "Complete React Developer Course",
    instructor: "John Doe",
    thumbnail: "/api/placeholder/400/225",
    progress: 65,
    currentLesson: "React Hooks Deep Dive",
    duration: "28.5 hours",
    lastAccessed: "2 days ago",
    nextLesson: "Context API & useReducer",
  },
  {
    id: 2,
    title: "Advanced JavaScript Patterns",
    instructor: "Jane Smith",
    thumbnail: "/api/placeholder/400/225",
    progress: 30,
    currentLesson: "Module Pattern vs Singleton",
    duration: "18 hours",
    lastAccessed: "1 week ago",
    nextLesson: "Factory and Observer Patterns",
  },
];

export function ContinueLearning() {
  if (continueLearningCourses.length === 0) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Continue Learning
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            No courses in progress
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Start learning by enrolling in a new course!
          </p>
          <Link
            href="/user/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-[#02517b]px-6 py-3 font-medium text-white transition-colors hover:bg-[#1A6A93]"
          >
            Browse Courses
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Continue Learning
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {continueLearningCourses.map((course) => (
          <div
            key={course.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-shrink-0 md:w-48">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-48 w-full object-cover md:h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <button className="transform rounded-full bg-white bg-opacity-90 p-3 transition-all hover:scale-105 hover:bg-opacity-100">
                    <Play className="ml-1 h-6 w-6 text-gray-900" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="flex h-full flex-col">
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                      by {course.instructor}
                    </p>

                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Current: {course.currentLesson}</span>
                        <span>{course.progress}% complete</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} total</span>
                      </div>
                      <span>•</span>
                      <span>Last accessed: {course.lastAccessed}</span>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        Next: {course.nextLesson}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex gap-3">
                      <Link
                        href={`/user/courses/${course.id}/learn`}
                        className="flex items-center gap-2 rounded-lg bg-[#02517b]px-6 py-2 font-medium text-white transition-colors hover:bg-[#1A6A93]"
                      >
                        <Play className="h-4 w-4" />
                        Continue
                      </Link>
                      <Link
                        href={`/user/courses/${course.id}`}
                        className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Course Details
                      </Link>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {course.progress}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
