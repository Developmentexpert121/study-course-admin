// components/dashboard/LearningStats.tsx
import { Clock, Calendar, Award, Target } from "lucide-react";

interface LearningStatsProps {
  learningTime: number;
  joinDate: string;
}

export function LearningStats({ learningTime, joinDate }: LearningStatsProps) {
  const hours = Math.floor(learningTime / 60);
  const minutes = learningTime % 60;
  const joinDateFormatted = new Date(joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const stats = [
    {
      icon: Clock,
      label: "Learning Time",
      value: `${hours}h ${minutes}m`,
      description: "Total time spent",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: joinDateFormatted,
      description: "Started learning",
    },
    {
      icon: Award,
      label: "Courses Completed",
      value: "3",
      description: "Certificates earned",
    },
    {
      icon: Target,
      label: "Current Goals",
      value: "2",
      description: "Active learning goals",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Learning Statistics
      </h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
