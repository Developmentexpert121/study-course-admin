// components/course-learn/DebugSection.tsx
import React from "react";

interface DebugSectionProps {
  userId: string | null;
  courseId: string | null;
  courseProgress: any | null;
  initializeProgress: () => void;
  course: any | null;
  handleLessonComplete: (lessonId: number, chapterId: number) => void;
}

const DebugSection: React.FC<DebugSectionProps> = ({
  userId,
  courseId,
  courseProgress,
  initializeProgress,
  course,
  handleLessonComplete,
}) => {
  return (
    <div className="mb-4 border-l-4 border-yellow-500 bg-yellow-100 p-4">
      <h3 className="font-bold">Debug Info</h3>
      <p>User ID: {userId}</p>
      <p>Course ID: {courseId}</p>
      <p>Course Progress Loaded: {courseProgress ? "Yes" : "No"}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={initializeProgress}
          className="rounded bg-green-500 px-3 py-1 text-sm text-white"
        >
          Initialize Progress
        </button>
        {course?.chapters[0]?.lessons[0] && (
          <button
            onClick={() => {
              handleLessonComplete(
                course.chapters[0].lessons[0].id,
                course.chapters[0].id,
              );
            }}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
          >
            Test Mark First Lesson Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default DebugSection;
