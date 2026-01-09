// components/course-learn/CourseTabs.tsx
import React from "react";
import OverviewTab from "./OverviewTab";
import ReviewsTab from "./ReviewTab";
import { BookOpen, Star, MessageSquare, Target } from "lucide-react";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface CourseTabsContentProps {
  activeTab: string;
  course: any;
  courseProgress: any | null;
  selectedLesson: { chapter: any; lesson: any } | null;
}

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "reviews", label: "Reviews", icon: Star },
];

const CourseTabs: React.FC<CourseTabsProps> & {
  Content: React.FC<CourseTabsContentProps>;
} = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-200 bg-white/90 px-8 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:border-[ #02517b] dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CourseTabsContent: React.FC<CourseTabsContentProps> = ({
  activeTab,
  course,
  courseProgress,
  selectedLesson,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab course={course} courseProgress={courseProgress} />;

      case "reviews":
        return <ReviewsTab course={course} />;

      default:
        return <OverviewTab course={course} courseProgress={courseProgress} />;
    }
  };

  return (
    <div className="min-h-[400px] rounded-2xl bg-white/50 p-6 backdrop-blur-sm dark:bg-slate-800/50">
      {renderTabContent()}
    </div>
  );
};

CourseTabs.Content = CourseTabsContent;

export default CourseTabs;
