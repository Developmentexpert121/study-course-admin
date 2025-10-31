"use client";

import { Suspense } from "react";
import HomeContent from "./_components/home-content";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";

interface SearchParams {
  selected_time_frame?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { selected_time_frame } = resolvedSearchParams;

  return (
    <Suspense fallback={<OverviewCardsSkeleton />}>
      <HomeContent initialTimeFrame={selected_time_frame} />
    </Suspense>
  );
}
