// components/course-learn/CourseHeader.tsx
import React from "react";
import { Share2, Star, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

interface CourseHeaderProps {
  title: string;
  progress?: number;
  courseId: string | null;
  onRateClick?: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  progress,
  courseId,
  onRateClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/user/dashboard"
            className="flex items-center gap-2 rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:block">Back to Courses</span>
          </Link>

          <div className="h-6 w-px bg-gray-600"></div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h1 className="max-w-xs truncate text-lg font-bold sm:max-w-md md:max-w-2xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          {progress !== undefined && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-green-400">
                  {progress}%
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:block">Share</span>
            </button>

            <button
              onClick={onRateClick}
              className="flex items-center gap-2 rounded-lg bg-yellow-500/20 px-3 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/30"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:block">Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3 sm:hidden">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Course Progress</span>
            <span className="font-medium text-green-400">{progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseHeader;
