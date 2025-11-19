// components/dashboard/LearningGoals.tsx
import { Target, Calendar, Trophy } from "lucide-react";

const learningGoals = [
  {
    id: 1,
    title: "Complete React Mastery",
    target: "Finish by Dec 30, 2024",
    progress: 65,
    courses: 3,
    type: "skill",
    icon: Target,
  },
  {
    id: 2,
    title: "Learn Backend Development",
    target: "Finish by Jan 15, 2025",
    progress: 30,
    courses: 2,
    type: "career",
    icon: Trophy,
  },
];

export function LearningGoals() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Learning Goals
        </h2>
        <button className="font-medium text-blue-600 hover:text-blue-700">
          + Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {learningGoals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <goal.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {goal.target}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{goal.courses} courses</span>
              <button className="font-medium text-blue-600 hover:text-blue-700">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
