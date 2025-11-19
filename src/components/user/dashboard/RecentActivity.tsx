// components/dashboard/RecentActivity.tsx
import { Clock, BookOpen, Award, MessageSquare } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "progress",
    icon: BookOpen,
    title: "Completed section",
    course: "React Advanced Patterns",
    time: "2 hours ago",
    color: "text-green-500",
  },
  {
    id: 2,
    type: "achievement",
    icon: Award,
    title: "Earned badge",
    description: "Quick Learner",
    time: "1 day ago",
    color: "text-yellow-500",
  },
  {
    id: 3,
    type: "comment",
    icon: MessageSquare,
    title: "Posted question",
    course: "JavaScript Fundamentals",
    time: "2 days ago",
    color: "text-blue-500",
  },
  {
    id: 4,
    type: "progress",
    icon: Clock,
    title: "Started new course",
    course: "Node.js Backend Development",
    time: "3 days ago",
    color: "text-purple-500",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}
              >
                <activity.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                {activity.course || activity.description}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
