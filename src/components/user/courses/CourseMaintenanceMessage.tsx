// components/CourseMaintenanceMessage.tsx
import { AlertCircle, BookOpen, FileQuestion, Clock } from "lucide-react";

interface MaintenanceMessageProps {
  course: any;
  className?: string;
}

export const CourseMaintenanceMessage = ({
  course,
  className,
}: MaintenanceMessageProps) => {
  const hasChapters = course.has_chapters;
  const allChaptersHaveLessons = course.all_chapters_have_lessons;
  const allChaptersHaveMCQs = course.all_chapters_have_mcqs;

  // If course has no chapters at all
  if (!hasChapters) {
    return (
      <div
        className={`rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Course Content Being Prepared
            </h4>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
              This course doesn't have any chapters yet. Content will be
              available soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If some chapters are missing lessons
  if (!allChaptersHaveLessons && !allChaptersHaveMCQs) {
    return (
      <div
        className={`rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600 dark:text-orange-400" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Course Under Development
            </h4>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
              Some chapters are missing lessons and MCQs. The course is being
              prepared for full launch.
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>
                  {course.chapters_with_lessons}/{course.totalChapters} chapters
                  have lessons
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FileQuestion className="h-3 w-3" />
                <span>
                  {course.chapters_with_mcqs}/{course.totalChapters} chapters
                  have MCQs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If only lessons are missing
  if (!allChaptersHaveLessons) {
    return (
      <div
        className={`rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20 ${className}`}
      >
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Lessons Being Added
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              Some chapters are missing video lessons. You can still explore
              available content.
            </p>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              {course.chapters_with_lessons} of {course.totalChapters} chapters
              have lessons
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If only MCQs are missing
  if (!allChaptersHaveMCQs) {
    return (
      <div
        className={`rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20 ${className}`}
      >
        <div className="flex items-start gap-3">
          <FileQuestion className="mt-0.5 h-5 w-5 text-purple-600 dark:text-purple-400" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Assessments Being Prepared
            </h4>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-400">
              Some chapters are missing MCQs. You can start learning with
              available lessons.
            </p>
            <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
              {course.chapters_with_mcqs} of {course.totalChapters} chapters
              have MCQs
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
