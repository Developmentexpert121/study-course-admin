// app/_components/overview-cards/index.tsx
import { compactFormat } from "@/lib/format-number";

import * as icons from "../icons";
import { OverviewCard } from "../card";

interface OverviewCardsGroupProps {
  users: any[];
  overviewData?: {
    totalUsers?: number;
    verifiedUsers?: number;
    adminUsers?: number;
    activeCourses?: number;
    inactiveCourses?: number;
    enrolledCourses?: number;
  };
}

export function OverviewCardsGroup({
  users,
  overviewData,
}: OverviewCardsGroupProps) {
  // Provide default values if overviewData is undefined
  const {
    totalUsers = 0,
    verifiedUsers = 0,
    adminUsers = 0,
    activeCourses = 0,
    inactiveCourses = 0,
    enrolledCourses = 0,
  } = overviewData || {};

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <OverviewCard
        label="Total Users"
        data={{ value: compactFormat(totalUsers), growthRate: 0 }}
        Icon={icons.Users}
      />
      <OverviewCard
        label="Verified Users"
        data={{ value: compactFormat(verifiedUsers), growthRate: 0 }}
        Icon={icons.Users}
      />
      <OverviewCard
        label="Admin Users"
        data={{ value: compactFormat(adminUsers), growthRate: 0 }}
        Icon={icons.Users}
      />
      <OverviewCard
        label="Active Courses"
        data={{ value: compactFormat(activeCourses), growthRate: 0 }}
        Icon={icons.Product}
      />
      <OverviewCard
        label="Inactive Courses"
        data={{ value: compactFormat(inactiveCourses), growthRate: 0 }}
        Icon={icons.Product}
      />
      <OverviewCard
        label="Enrolled Courses"
        data={{ value: compactFormat(enrolledCourses), growthRate: 0 }}
        Icon={icons.Product}
      />
    </div>
  );
}
