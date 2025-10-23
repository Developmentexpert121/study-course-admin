import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup({users}: any) {
  const data = await getOverviewData();
  
  // Provide default values if data is undefined
  const {
    totalUsers = 0,
    verifiedUsers = 0,
    adminUsers = 0,
    activeCourses = 0,
    inactiveCourses = 0,
    enrolledCourses = 0
  } = data || {};


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
