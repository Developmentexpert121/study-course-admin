// components/dashboard/WelcomeBanner.tsx
"use client";

import { Rocket, BookOpen } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const currentHour = new Date().getHours();
  let greeting = "Good evening";

  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-32 translate-x-32 rounded-full bg-white/10"></div>
      <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              <span className="text-sm font-medium text-blue-100">
                {greeting}
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">
              Welcome back, {userName}! 👋
            </h1>
            <p className="max-w-2xl text-blue-100">
              Ready to continue your learning journey? You're making great
              progress! Keep going to unlock new skills and achievements.
            </p>
          </div>
          <div className="mt-4 flex gap-3 md:mt-0">
            <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </button>
            <button className="rounded-lg border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/30">
              Learning Path
            </button>
          </div>
        </div>

        {/* Quick Progress */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
            <div className="text-sm text-blue-100">Today's Goal</div>
            <div className="font-semibold">30 min / 60 min</div>
          </div>
          <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
            <div className="text-sm text-blue-100">Weekly Streak</div>
            <div className="font-semibold">5 days 🔥</div>
          </div>
        </div>
      </div>
    </div>
  );
}
