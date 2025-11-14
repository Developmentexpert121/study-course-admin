import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface StatsCardsProps {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  roleName: string;
  icon: React.ReactNode;
}

export default function StatsCards({
  totalCount,
  activeCount,
  inactiveCount,
  roleName,
  icon,
}: StatsCardsProps) {
  const stats = [
    {
      title: `Total ${roleName}s`,
      value: totalCount,
      icon: icon,
      color:
        "bg-[#02517b]/10 text-[#02517b] dark:bg-[#43bf79]/20 dark:text-[#43bf79]",
    },
    {
      title: `Active ${roleName}s`,
      value: activeCount,
      icon: <CheckCircle className="h-6 w-6" />,
      color:
        "bg-green-100 text-green-600 dark:bg-[#43bf79]/20 dark:text-[#43bf79]",
    },
    {
      title: `Inactive ${roleName}s`,
      value: inactiveCount,
      icon: <XCircle className="h-6 w-6" />,
      color: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-white">
                {stat.title}
              </p>
              <p
                className={`mt-1 text-3xl font-bold ${stat.color.includes("text-") ? stat.color.split(" ")[1] : ""}`}
              >
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${stat.color.split(" ")[0]}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
