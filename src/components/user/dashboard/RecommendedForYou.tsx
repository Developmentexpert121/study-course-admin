// components/dashboard/RecommendedForYou.tsx

import { CourseCard } from "../courses/CourseCard";

const recommendedCourses = [
  {
    id: 5,
    title: "TypeScript for React Developers",
    instructor: "Alex Johnson",
    price: 89.99,
    rating: 4.8,
    students: 8921,
    duration: "14.5 hours",
    image: "/api/placeholder/300/200",
    category: "Development",
    level: "Intermediate",
    status: "not-started",
    badge: "Popular",
  },
  {
    id: 6,
    title: "AWS Certified Solutions Architect",
    instructor: "Maria Garcia",
    price: 99.99,
    rating: 4.9,
    students: 15632,
    duration: "32 hours",
    image: "/api/placeholder/300/200",
    category: "Cloud",
    level: "Advanced",
    status: "not-started",
    badge: "Bestseller",
  },
  {
    id: 7,
    title: "UI/UX Design Masterclass",
    instructor: "David Chen",
    price: 79.99,
    rating: 4.7,
    students: 7432,
    duration: "20 hours",
    image: "/api/placeholder/300/200",
    category: "Design",
    level: "All Levels",
    status: "not-started",
  },
  {
    id: 8,
    title: "Python for Machine Learning",
    instructor: "Dr. Sarah Wilson",
    price: 94.99,
    rating: 4.8,
    students: 21045,
    duration: "28 hours",
    image: "/api/placeholder/300/200",
    category: "Data Science",
    level: "Intermediate",
    status: "not-started",
    badge: "Hot & New",
  },
];

export function RecommendedForYou() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recommended For You
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Based on your learning history and interests
          </p>
        </div>
        <button className="font-medium text-blue-600 hover:text-blue-700">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recommendedCourses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
