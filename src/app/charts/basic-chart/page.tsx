import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import ChartPageClient from "../../user/ChartPageClient";

export const metadata: Metadata = {
  title: "Chart",
};

// Define the expected type for searchParams
interface SearchParams {
  selected_time_frame?: string;
}

// Update the Page function to handle searchParams as a Promise
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(
    resolvedSearchParams.selected_time_frame,
  );
  const timeFrameKey =
    extractTimeFrame("used_devices") ?? "used_devices:monthly";

  return (
    <>
      <Breadcrumb pageName="Chart" />
      <ChartPageClient timeFrameKey={timeFrameKey} />
    </>
  );
}
