// components/courses/CourseGrid.tsx
"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "./CourseCard";

interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  image: string;
  progress?: number;
  category: string;
  level: string;
  status: "in-progress" | "completed" | "not-started";
  badge?: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Complete React Developer Course",
    instructor: "John Doe",
    price: 94.99,
    rating: 4.7,
    students: 12543,
    duration: "28.5 hours",
    image: "/api/placeholder/300/200",
    progress: 65,
    category: "Development",
    level: "Intermediate",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Advanced JavaScript Patterns",
    instructor: "Jane Smith",
    price: 84.99,
    rating: 4.8,
    students: 8921,
    duration: "18 hours",
    image: "/api/placeholder/300/200",
    progress: 30,
    category: "Development",
    level: "Advanced",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Mike Johnson",
    price: 74.99,
    rating: 4.6,
    students: 15632,
    duration: "24 hours",
    image: "/api/placeholder/300/200",
    progress: 100,
    category: "Data Science",
    level: "Beginner",
    status: "completed",
  },
  {
    id: 4,
    title: "UX/UI Design Fundamentals",
    instructor: "Sarah Wilson",
    price: 64.99,
    rating: 4.5,
    students: 7432,
    duration: "16 hours",
    image: "/api/placeholder/300/200",
    category: "Design",
    level: "Beginner",
    status: "not-started",
  },
  {
    id: 5,
    title: "Node.js Backend Development",
    instructor: "Alex Brown",
    price: 89.99,
    rating: 4.7,
    students: 11234,
    duration: "22 hours",
    image: "/api/placeholder/300/200",
    progress: 45,
    category: "Development",
    level: "Intermediate",
    status: "in-progress",
  },
  {
    id: 6,
    title: "Mobile App Development with React Native",
    instructor: "Chris Lee",
    price: 79.99,
    rating: 4.4,
    students: 6789,
    duration: "19 hours",
    image: "/api/placeholder/300/200",
    progress: 100,
    category: "Mobile",
    level: "Intermediate",
    status: "completed",
  },
  {
    id: 7,
    title: "DevOps Fundamentals",
    instructor: "Maria Garcia",
    price: 99.99,
    rating: 4.8,
    students: 8923,
    duration: "26 hours",
    image: "/api/placeholder/300/200",
    category: "DevOps",
    level: "Beginner",
    status: "not-started",
  },
  {
    id: 8,
    title: "Advanced CSS and Sass",
    instructor: "David Kim",
    price: 69.99,
    rating: 4.6,
    students: 14567,
    duration: "15 hours",
    image: "/api/placeholder/300/200",
    progress: 80,
    category: "Web Development",
    level: "Intermediate",
    status: "in-progress",
  },
];

interface CourseGridProps {
  filter: string;
}

export function CourseGrid({ filter }: CourseGridProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);

  useEffect(() => {
    if (filter === "all") {
      setFilteredCourses(mockCourses);
    } else if (filter === "in-progress") {
      setFilteredCourses(
        mockCourses.filter((course) => course.status === "in-progress"),
      );
    } else if (filter === "completed") {
      setFilteredCourses(
        mockCourses.filter((course) => course.status === "completed"),
      );
    } else if (filter === "wishlist") {
      setFilteredCourses(
        mockCourses.filter((course) => course.status === "not-started"),
      );
    }
  }, [filter]);

  if (filteredCourses.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400 dark:text-gray-500">📚</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          No courses found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {filter === "in-progress"
            ? "You don't have any courses in progress yet."
            : filter === "completed"
              ? "You haven't completed any courses yet."
              : "No courses match your filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
