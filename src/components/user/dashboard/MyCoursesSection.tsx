// components/dashboard/MyCoursesSection.tsx
"use client";

import { useState } from "react";
import { CourseFilters } from "../courses/CourseFilters";
import { CourseGrid } from "../courses/CourseGrid";

export function MyCoursesSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <section>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Continue your learning journey
          </p>
        </div>
        <CourseFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <CourseGrid filter={activeFilter} />
    </section>
  );
}
