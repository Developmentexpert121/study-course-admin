// components/courses/CourseFilters.tsx
"use client";

interface CourseFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "All Courses", count: 8 },
  { id: "in-progress", label: "In Progress", count: 4 },
  { id: "completed", label: "Completed", count: 2 },
  { id: "wishlist", label: "Wishlist", count: 2 },
];

export function CourseFilters({
  activeFilter,
  onFilterChange,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.id
              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {filter.label}
          <span
            className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
              activeFilter === filter.id
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
