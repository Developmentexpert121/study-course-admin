"use client";

import { useEffect, useState } from "react";
import { UsedDevices } from "@/components/Charts/used-devices/page";
import { useApiClient } from "@/lib/api";

interface Props {
  timeFrameKey: string;
}

export default function ChartPageClient({ timeFrameKey }: Props) {
  const [chartData, setChartData] = useState<any[]>([]);
  const api = useApiClient();

  const timeFrame = timeFrameKey?.split(":")[1] || "monthly";

  const fetchCourses = async () => {
    try {
      const res = await api.get("user/stats");

      const rawData = res.data?.data?.[timeFrame] || [];

      const formatted = rawData.map((item: any) => ({
        name: item.month || item.year,
        amount: Number(item.count),
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [timeFrame]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <UsedDevices
        key={timeFrameKey}
        timeFrame={timeFrame}
        className="col-span-12 xl:col-span-5"
        data={chartData}
      />
    </div>
  );
}
