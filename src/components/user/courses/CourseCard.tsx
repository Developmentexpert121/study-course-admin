// components/courses/CourseCard.tsx
import Link from "next/link";
import { Star, Users, Clock, CheckCircle, Award, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";

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
  description?: string;
  price_type?: "free" | "paid";
}

interface CourseCardProps {
  course: Course;
  showWishlistButton?: boolean;
}

export function CourseCard({
  course,
  showWishlistButton = true,
}: CourseCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if course is in wishlist
  useEffect(() => {
    setIsWishlisted(isInWishlist(course.id));
  }, [wishlist, course.id, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    e.stopPropagation();

    if (isWishlisted) {
      await removeFromWishlist(course.id);
    } else {
      await addToWishlist(course);
    }
  };

  const getStatusBadge = () => {
    switch (course.status) {
      case "in-progress":
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getBadge = () => {
    if (!course.badge) return null;

    const badgeColors: { [key: string]: string } = {
      Popular: "bg-orange-100 text-orange-800",
      Bestseller: "bg-purple-100 text-purple-800",
      "Hot & New": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${badgeColors[course.badge] || "bg-gray-100 text-gray-800"}`}
      >
        {course.badge}
      </span>
    );
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Course Image */}
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 w-full object-cover"
        />
        {course.progress !== undefined && course.status === "in-progress" && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {getStatusBadge()}
          {getBadge()}
        </div>

        {/* Wishlist Button */}
        {showWishlistButton && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute left-3 top-3 rounded-full p-2 shadow-md transition-all duration-200 ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
              size={16}
            />
          </button>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight text-gray-900 dark:text-white">
          {course.title}
        </h3>

        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {course.instructor}
        </p>

        <div className="mb-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {course.price_type === "free" ? "Free" : `$${course.price}`}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {course.level}
              </span>
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                {course.category}
              </span>
            </div>
          </div>
          <Link
            href={`/user/courses/${course.id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 hover:shadow-md"
          >
            {course.status === "in-progress"
              ? "Continue"
              : course.status === "completed"
                ? "Review"
                : "Enroll"}
          </Link>
        </div>
      </div>
    </div>
  );
}
