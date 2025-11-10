import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CurriculumTab from "./CurriculumTab";
import OverviewTab from "./OverviewTab";
import FeaturesTab from "./FeaturesTab";
import ProgressTab from "./ProgressTab";

interface CourseTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  courseData: any;
  statistics: any;
  userData: any;
  isEnrolled: boolean;
  courseId: any;
}

export default function CourseTabs({
  activeTab,
  onTabChange,
  courseData,
  statistics,
  userData,
  isEnrolled,
  courseId,
}: CourseTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "features", label: "What You'll Learn" },
    ...(isEnrolled ? [{ id: "progress", label: "My Progress" }] : []),
  ];

  return (
    <>
      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        {activeTab === "overview" && (
          <OverviewTab
            statistics={statistics}
            userData={userData}
            isEnrolled={isEnrolled}
            courseData={courseData}
          />
        )}

        {activeTab === "curriculum" && (
          <CurriculumTab
            chapters={courseData.chapters || []}
            statistics={statistics}
            isEnrolled={isEnrolled}
            courseId={courseId}
          />
        )}

        {activeTab === "features" && (
          <FeaturesTab features={courseData.features} />
        )}

        {activeTab === "progress" && isEnrolled && (
          <div id="progress-section" className="scroll-mt-20">
            {" "}
            {/* Add ID here */}
            <ProgressTab
              userData={userData}
              chapters={courseData.chapters || []}
              statistics={statistics}
            />
          </div>
        )}
      </div>
    </>
  );
}
