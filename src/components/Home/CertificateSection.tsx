// components/CertificateSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CertificateSection: React.FC = () => {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden bg-[#02527c05] bg-center bg-no-repeat py-20"
      style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
      {/* Moving dotted circle left */}
      <div className="absolute left-0 top-1/4 h-24 w-24">
        <div className="relative h-full w-full">
          {/* Spinning background circle */}
          <div className="spin-circle absolute left-7 h-24 w-24 rounded-full border-2 bg-[#02517b]"></div>

          {/* Moving top-to-bottom circle */}
          <div className="move-circle absolute left-4 top-0 h-16 w-16 rounded-full bg-white opacity-50"></div>
        </div>
      </div>

      {/* Moving dotted grid right */}
      <div className="absolute right-0 top-1/4 h-24 w-24">
        <div className="mobile grid grid-cols-4 gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-75"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
          <div className="bg-[#02517b]delay-200 h-2 w-2 animate-pulse rounded-full"></div>
          <div className="delay-50 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="bg-[#02517b]delay-100 h-2 w-2 animate-pulse rounded-full"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
          <div className="bg-[#02517b]delay-200 h-2 w-2 animate-pulse rounded-full"></div>
          <div className="bg-[#02517b]delay-75 h-2 w-2 animate-pulse rounded-full"></div>
          <div className="delay-125 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="delay-175 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="delay-225 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="delay-50 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-100"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-200"></div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <h1 className="mb-4 text-center text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
          Earn a Professional{" "}
          <span className="text-[#02517b]">Certificate</span> and Advance Your
          Skills
        </h1>

        <a
          onClick={() => router.push("/auth/register")}
          className="inline-block rounded-lg bg-[#02517b] px-6 py-3 font-medium text-white transition hover:bg-[#5687a1bf]"
        >
          Get started now →
        </a>
      </div>
    </section>
  );
};

export default CertificateSection;
