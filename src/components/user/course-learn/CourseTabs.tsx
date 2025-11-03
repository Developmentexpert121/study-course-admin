// components/course-learn/CourseTabs.tsx
import React from "react";
import OverviewTab from "./OverviewTab";
import ReviewsTab from "./ReviewTab";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface CourseTabsContentProps {
  activeTab: string;
  course: any;
  courseProgress: any | null;
}

const tabs = [
  "Overview",
  // "Notes",
  // "Announcements",
  "Reviews",
  // "Learning tools",
];

const CourseTabs: React.FC<CourseTabsProps> & {
  Content: React.FC<CourseTabsContentProps>;
} = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap justify-start gap-4 border-b border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab
              ? "border-blue-500 text-blue-500 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Tab Content Component
const CourseTabsContent: React.FC<CourseTabsContentProps> = ({
  activeTab,
  course,
  courseProgress,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab course={course} courseProgress={courseProgress} />;

      case "Reviews":
        return <ReviewsTab course={course} />;

      case "Notes":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              My Notes
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You can add your personal notes here for quick revision later.
            </p>
          </div>
        );

      case "Announcements":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Stay tuned for the latest updates and news about the course!
            </p>
          </div>
        );

      case "Learning tools":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Learning Tools
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access additional resources, exercises, and code snippets here.
            </p>
          </div>
        );

      default:
        return <OverviewTab course={course} courseProgress={courseProgress} />;
    }
  };

  return <div className="min-h-[400px]">{renderTabContent()}</div>;
};

// Attach Content as a static property
CourseTabs.Content = CourseTabsContent;

export default CourseTabs;
