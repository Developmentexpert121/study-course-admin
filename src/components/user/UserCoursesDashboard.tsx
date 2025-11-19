// components/UserCoursesDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";
import { WelcomeBanner } from "./dashboard/WelcomeBanner";
import { LearningStats } from "./dashboard/LearningStats";
import { RecentActivity } from "./dashboard/RecentActivity";
import { LearningGoals } from "./dashboard/LearningGoals";
import { MyCoursesSection } from "./dashboard/MyCoursesSection";
import { RecommendedForYou } from "./dashboard/RecommendedForYou";
import { ContinueLearning } from "./dashboard/ContinueLearning";

export default function UserCoursesDashboard() {
  const [userData, setUserData] = useState<any>({
    name: "",
    joinDate: "",
    learningTime: 0,
  });

  useEffect(() => {
    const name = getDecryptedItem("name") || "Student";
    const joinDate = getDecryptedItem("joinDate") || new Date().toISOString();

    setUserData({
      name,
      joinDate,
      learningTime: 1250, // Mock data - in minutes
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WelcomeBanner userName={userData.name} />
        </div>
        <div className="lg:col-span-1">
          <LearningStats
            learningTime={userData.learningTime}
            joinDate={userData.joinDate}
          />
        </div>
      </div>

      {/* Continue Learning & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueLearning />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Learning Goals */}
      <LearningGoals />

      {/* My Courses */}
      <MyCoursesSection />

      {/* Recommended Courses */}
      <RecommendedForYou />
    </div>
  );
}
