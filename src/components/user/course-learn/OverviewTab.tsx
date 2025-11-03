// components/course-learn/OverviewTab.tsx
import React from "react";

interface OverviewTabProps {
  course: any;
  courseProgress: any | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  course,
  courseProgress,
}) => {
  // Extract ratings data from course or courseProgress
  const ratings = course.ratings || courseProgress?.ratings;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">{course.title}</h1>
      {course.subtitle && (
        <h2 className="mb-4 text-xl text-gray-600 dark:text-gray-400">
          {course.subtitle}
        </h2>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        {/* Ratings Display */}
        {ratings?.statistics && (
          <span className="flex items-center gap-1">
            ⭐ {ratings.statistics.average_rating.toFixed(1)}
            <span className="text-xs text-gray-500">
              ({ratings.statistics.total_ratings}{" "}
              {ratings.statistics.total_ratings === 1 ? "rating" : "ratings"})
            </span>
          </span>
        )}
        <span>{course.enrollment_count} Students</span>
        <span>{course.duration} Total</span>
        {courseProgress && (
          <span className="text-green-500">
            {courseProgress.overall_progress}% Completed
          </span>
        )}
      </div>

      <div
        className="max-w-3xl whitespace-pre-line text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />

      {/* Course Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics?.total_chapters || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Chapters
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics?.total_lessons || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Lessons
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics?.total_mcqs || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">MCQs</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.enrollment_count || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Enrolled
          </div>
        </div>
      </div>

      {/* Detailed Ratings Section */}
      {ratings?.statistics && (
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Course Ratings</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Average Rating */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500">
                    {ratings.statistics.average_rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(ratings.statistics.average_rating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {ratings.statistics.total_ratings}{" "}
                    {ratings.statistics.total_ratings === 1
                      ? "rating"
                      : "ratings"}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h4 className="mb-3 font-semibold">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-8 text-sm text-gray-600 dark:text-gray-400">
                      {rating} ★
                    </span>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-yellow-500"
                          style={{
                            width: `${ratings.statistics.percentage_distribution[rating] || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="w-12 text-xs text-gray-600 dark:text-gray-400">
                      {ratings.statistics.rating_distribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User's Rating */}
      {ratings?.user_rating && (
        <div className="mt-6 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h4 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
            Your Rating
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < ratings.user_rating.score
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {ratings.user_rating.score}.0
            </span>
          </div>
          {ratings.user_rating.review && (
            <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
              {ratings.user_rating.review}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
