// components/course-learn/LessonItem.tsx
import React from "react";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  Video,
  FileText,
} from "lucide-react";

interface LessonItemProps {
  lesson: any;
  locked: boolean;
  completed?: boolean;
  isSelected?: boolean;
  onLessonClick: () => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  locked,
  completed = false,
  isSelected = false,
  onLessonClick,
}) => {
  // Allow preview lessons to be accessible even if chapter is locked
  const isAccessible = !locked || lesson.is_preview;

  // Determine content type for appropriate icon
  const getContentTypeIcon = () => {
    if (lesson.video_url) return Video;
    if (lesson.content && !lesson.video_url) return FileText;
    return PlayCircle;
  };

  const ContentIcon = getContentTypeIcon();

  const getLessonStatus = () => {
    if (!isAccessible) return "locked";
    if (completed) return "completed";
    if (isSelected) return "selected";
    return "available";
  };

  const status = getLessonStatus();

  const statusConfig = {
    locked: {
      bg: "bg-gray-100 dark:bg-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      text: "text-gray-400 dark:text-gray-500",
      icon: "text-gray-400",
      duration: "text-gray-400",
      cursor: "cursor-not-allowed",
    },
    completed: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
      icon: "text-green-500",
      duration: "text-green-600 dark:text-green-400",
      cursor: "cursor-pointer",
    },
    selected: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-700",
      text: "text-blue-700 dark:text-blue-300",
      icon: "text-blue-500",
      duration: "text-blue-600 dark:text-blue-400",
      cursor: "cursor-pointer",
    },
    available: {
      bg: "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50",
      border: "border-gray-200 dark:border-gray-600",
      text: "text-gray-700 dark:text-gray-300",
      icon: "text-gray-400 group-hover:text-blue-500",
      duration: "text-gray-500 dark:text-gray-400",
      cursor: "cursor-pointer",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      onClick={isAccessible ? onLessonClick : undefined}
      className={`group flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
        config.bg
      } ${config.border} ${config.cursor}`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {!isAccessible ? (
          <div className="rounded-full bg-gray-200 p-1.5 dark:bg-gray-600">
            <Lock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          </div>
        ) : completed ? (
          <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-800/30">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </div>
        ) : (
          <div className="rounded-full bg-blue-100 p-1.5 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-800/50">
            <ContentIcon className={`h-3.5 w-3.5 ${config.icon}`} />
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className={`truncate text-sm font-medium ${config.text}`}>
              {lesson.title}
            </h4>

            {/* Lesson Metadata */}
            <div className="mt-1 flex items-center gap-3 text-xs">
              {/* Content Type Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                  !isAccessible
                    ? "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                    : completed
                      ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {lesson.video_url ? (
                  <>
                    <Video className="h-3 w-3" />
                    <span>Video</span>
                  </>
                ) : lesson.content ? (
                  <>
                    <FileText className="h-3 w-3" />
                    <span>Reading</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3 w-3" />
                    <span>Lesson</span>
                  </>
                )}
              </span>

              {/* Duration */}
              {lesson.duration && (
                <span className={`flex items-center gap-1 ${config.duration}`}>
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration}m</span>
                </span>
              )}

              {/* Preview Badge */}
              {lesson.is_preview && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  Preview
                </span>
              )}
            </div>
          </div>

          {/* Completion Status for accessible lessons */}
          {isAccessible && completed && (
            <div className="flex-shrink-0">
              <div className="rounded-full bg-green-100 p-1 dark:bg-green-800/30">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator for in-progress lessons */}
        {isAccessible && !completed && isSelected && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              <div className="h-1.5 w-full rounded-full bg-blue-200 dark:bg-blue-700">
                <div
                  className="h-1.5 animate-pulse rounded-full bg-blue-500"
                  style={{ width: "60%" }}
                />
              </div>
              <span>Now Playing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
