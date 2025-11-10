// components/Banner.tsx
"use client";

import React from "react";

const Banner: React.FC = () => {
  return (
    <div
      className="banner relative h-[500px] overflow-hidden bg-cover bg-center bg-no-repeat md:h-[600px]"
      style={{ backgroundImage: "url('/images/img1.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/50"></div>

      {/* Banner content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center md:px-20">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
          Kickstart Your IT Journey
        </h1>
        <p className="mb-6 max-w-2xl text-base text-white md:text-lg">
          Learn the newest IT technologies and gain hands-on experience with
          courses designed to turn knowledge into real-world skills.
        </p>
        <a href="#courses" className="btn-corners">
          Explore Courses
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>

      {/* Floating circles with content */}
      <div className="absolute left-10 top-10 z-20 flex h-28 w-28 items-center justify-center rounded-full bg-orange-400/70 blur-2xl">
        <span className="text-lg font-bold text-white">Web</span>
      </div>
      <div className="absolute bottom-20 right-20 z-20 flex h-32 w-32 items-center justify-center rounded-full bg-blue-400/60 blur-2xl">
        <span className="text-lg font-bold text-white">AI</span>
      </div>
      <div className="absolute left-3/4 top-1/2 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-pink-400/60 blur-2xl">
        <span className="text-lg font-bold text-white">UX</span>
      </div>
      <div className="absolute bottom-10 left-1/4 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-green-400/60 blur-2xl">
        <span className="text-lg font-bold text-white">SEO</span>
      </div>
    </div>
  );
};

export default Banner;
